import pandas as pd

class TimeSeries:

    def __init__(self, series: pd.Series) -> None:
        self.raw = series
        self.filled = None
        self.dropped = None

    def fill_nan(self, type='ffil'):
        if type == 'ffil':
            self.filled = self.raw.ffill()
        if type == 'backfil':
            self.filled = self.raw.backfill()
        if type == 'drop':
            self.filled = self.raw.dropna()
    
    def drop_cases(self):
        self.filled


    def handle_null(self, method='ffil'):
        # if method == 'ffil':
        pass

    def drop_data(self, dates_to_drop: set):
        return 
