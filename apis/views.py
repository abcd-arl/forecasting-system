from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.core.files import File
from django.core.files.base import ContentFile
from .models import Case
import pickle
import math
import pandas as pd
import numpy as np
import statsmodels.api as sm
from sklearn.metrics import mean_absolute_error, mean_squared_error, mean_absolute_percentage_error


@api_view(['GET', 'POST'])
def forecast(request):
    model = None
    if request.method == 'GET':
        recent_record = Case.objects.all().first()
        ts = pd.read_csv(recent_record.csv_file.url, index_col="Date").iloc[:, 0]
        ts.index = pd.to_datetime(ts.index)
        
        model_settings = recent_record.model_details["settings"]
        dates_to_drop = to_dates(model_settings["skips"])

        with recent_record.model.open() as f:
            serialized_model = f.read()
        model = pickle.loads(serialized_model)

    elif request.method == 'POST':
        series = request.data['series']
        ts = pd.Series([int(value) if isinstance(value, int) else None for value in series.values()], name='Number of New Cases')
        ts.index = pd.to_datetime(pd.Series(series.keys()))

        model_settings = request.data['settings']
        method = model_settings["method"]
        performance_measure = model_settings["performanceMeasure"]
        parameters = model_settings.get("modelParameters", None)
        dates_to_drop = to_dates(model_settings["skips"])
    
    raw_ts, (filled_ts, cleaned_ts) = ts.replace(np.nan, 'NaN', regex=True), fill_and_clean_ts(ts.copy(), dates_to_drop)
    if model is None:
        if method == 'automatic': model, _ = create_model(cleaned_ts, performance_measure)
        else:
            order = tuple(parameters["order"])
            seasonal_order = tuple(parameters["seasonalOrder"]) if len(parameters["seasonalOrder"]) == 4 else (0,0,0,0)
            model = sm.tsa.SARIMAX(cleaned_ts.values, order=order, seasonal_order=seasonal_order, enforce_stationarity=False).fit()

   
    num_forecast = get_num_forecast(raw_ts.index[-1], cleaned_ts.index[-1])
    start_date_index = (cleaned_ts.index[-1] + pd.DateOffset(months=1)).date()
    forecasts = generate_forecast(model, num_forecast, start_date_index)

    # skips = [date.strftime("%Y-%m-%d") for date in dates_to_drop]
    for ts in [raw_ts, filled_ts, cleaned_ts, forecasts]:
        ts.index = ts.index.astype(str) 
    
    time_series = {
        "time_series": {
            "raw": raw_ts.to_dict(),
            "filled": filled_ts.to_dict(),
            "cleaned": cleaned_ts.to_dict(),
        }
    }

    data = time_series | {"model_details": {"settings": model_settings}} | {"forecasts": forecasts.to_dict()}

    return Response(data)


@api_view(['GET', 'POST'])
@permission_classes((IsAuthenticated, ))
def update_table(request):
    if request.method == 'GET':
        recent_record = Case.objects.all().first()
        dates_to_drop = to_dates(recent_record.model_details["settings"]["skips"])
        ts = pd.read_csv(recent_record.csv_file.url, index_col="Date").iloc[:, 0]
        filled_ts, _ = fill_and_clean_ts(ts, dates_to_drop)

        return Response({"time_series": {"raw": ts.replace(np.nan, 'NaN', regex=True).to_dict(), "filled": filled_ts.to_dict()}} | {"model_details": recent_record.model_details})

    elif request.method == 'POST':
        try:
            series = request.data['series']
            ts = pd.Series([int(value) if isinstance(value, int) else None for value in series.values()], name='Number of New Cases')
            ts.index = pd.date_range(start=request.data['startingDateKey'], periods=len(ts), freq='M')
            ts.index.name = 'Date'

            model_settings = {
                "skips": request.data['settings']["skips"],
                "performance_measure":  request.data['settings']["performanceMeasure"],
            }
            
            dates_to_drop = to_dates(model_settings["skips"])
            raw_ts, (filled_ts, cleaned_ts) = ts.replace(np.nan, 'NaN', regex=True), fill_and_clean_ts(ts.copy(), dates_to_drop)
            model, model_info = create_model(cleaned_ts)

            model_details = {
                "settings": model_settings,
                "info": model_info
            }
         
            num_forecast = get_num_forecast(raw_ts.index[-1], cleaned_ts.index[-1])
            start_date_index = (cleaned_ts.index[-1] + pd.DateOffset(months=1)).date()
            forecasts = generate_forecast(model, num_forecast, start_date_index)

            for series in [raw_ts, filled_ts, cleaned_ts, forecasts]:
                series.index = series.index.astype(str)
            
            new_record = Case(model_details=model_details)

            ts.to_csv("apis/static/series.csv")
            f = open("apis/static/series.csv", "rb")
            myfile = File(f)
            new_record.csv_file.save('series.csv', myfile)

            model_string = pickle.dumps(model)
            model_file = ContentFile(model_string)
            new_record.model.save('model.pickle', model_file)
            
            new_record.save()

            time_series = {
                "time_series": {
                    "raw": raw_ts.to_dict(),
                    "filled": filled_ts.to_dict(),
                    "cleaned": cleaned_ts.to_dict(),
                }
            }

            

            return Response(time_series | {"model_details": model_details} | {"forecasts": forecasts.to_dict()})

        except ValueError:
            return Response(status=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)


def create_model(ts, perforamance_measure="rmse"):
    train, test = ts[:len(ts) - 12], ts[len(ts) - 12:]
    least_error = 100000
    
    info = {"test": test,
               "predicted": [],
               "residuals": [],
               "performance_measure" : {},
               "combination": ''}
    least_RMSE = 100000
    for p in range(0,1):
        for q in range(2,3):
            for P in range(2,3):
                for Q in range(3,4):
                    for lag in [6]:
                        d = 0
                        D = 0
                        
                        try:
                            model = sm.tsa.SARIMAX(train.values, order=(p,d,q), seasonal_order=(P,D,Q,lag), enforce_stationarity=False).fit()
                            predicted = model.forecast(len(test))

                            MSE = np.square(np.subtract(test, predicted)).mean()
                            RMSE = math.sqrt(MSE)

                            mae = mean_absolute_error(test.values, predicted)
                            rmse = mean_squared_error(test.values, predicted, squared=False)
                            mape = mean_absolute_percentage_error(test.values, predicted)

                            if perforamance_measure == 'mae': measurement_val = mae
                            elif perforamance_measure == 'mape': measurement_val = mape
                            else: measurement_val = rmse

                            if RMSE < least_RMSE:
                                least_RMSE = RMSE

                            if measurement_val < least_error:
                                least_error = measurement_val
                                info["performance_measure"]["mae"] = mae
                                info["performance_measure"]["rmse"] = rmse
                                info["performance_measure"]["mape"] = mape
                                info["combination"] = ((p, d, q), (P, D, Q, lag))
                                info["predicted"] = predicted

                        except Exception as e:
                            print('error:', str(e))
                            pass
    info["predicted"] = pd.Series(info["predicted"], index=test.index)
    info["residuals"] = info["predicted"] - test

    for series in [info["test"], info["predicted"], info["residuals"]]:
        series.index = series.index.astype(str)
    
    info["test"] = info["test"].to_dict()
    info["predicted"] = info["predicted"].to_dict()
    info["residuals"] = info["residuals"].to_dict()

    order, seasonal_order = info["combination"]
    final_model = sm.tsa.SARIMAX(ts.values, order=order, seasonal_order=seasonal_order, enforce_stationarity=False).fit()
    return final_model, info


def generate_forecast(model, num, start_date_index):
    forecasts = pd.Series(model.forecast(num))
    forecasts.index = pd.date_range(start=start_date_index, periods=num, freq='M')
    return forecasts


def to_dates(date_ranges):
    dates = set()
    for date_range in date_ranges:
        start, end = [pd.to_datetime(date) for date in date_range["dateKeysRange"]]
        dates = dates.union(set(pd.date_range(start, end, freq='m')))

    return dates


def get_num_forecast(raw_ts_recent_date, final_ts_recent_date):
    addOne = 1
    if raw_ts_recent_date == final_ts_recent_date: addOne = 0
    min_num_forecast = 12
    diff_months = (raw_ts_recent_date - final_ts_recent_date) // np.timedelta64(1,'M') + addOne
    return diff_months + min_num_forecast


def fill_and_clean_ts(ts, dates_to_drop):
    filled = ts.fillna(method='ffill')
    cleaned = filled[~(filled.index.isin(dates_to_drop))]
    return filled, cleaned