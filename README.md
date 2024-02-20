# forecasting-system
An Undergraduate Thesis Project

The Philippines continues to have an increasing number of new HIV infections and AIDS-related deaths. The situation has also been worsened by the COVID-19 outbreak limiting socioeconomic resources and disrupting HIV testing, treatment, and prevention services in the country. For this study, ARIMA, SARIMA, and exponential smoothing techniques are compared to select the best model for forecasting the next twelve months of HIV cases in the country. The grid search algorithm is implemented to determine the best combination of parameters for the models. Further, to generate an accurate forecast, only the data from January 2010 to December 2019 are used rather than the complete gathered data from January 2010 to November 2022. Results show that a SARIMA model is the best model in forecasting HIV cases after getting the least RMSE score of 94.67. It is also estimated that the highest number of cases is set in July with 1,984, whereas the lowest number is expected in June, with 1,477 cases.

A forecasting system is also developed to easily calculate the best model, visualize the results, and update the data.

https://user-images.githubusercontent.com/106197019/232374344-0f53efde-b39c-421f-87b6-c479d880c617.mov



The system's homepage provides a dashboard for users to interact with the data and automatically generate a new forecast. It offers visualization of the number of HIV cases in the Philippines, together with the forecasts made by the selected method in the study.

![Top Page of the Homepage](https://github.com/abcd-arl/forecasting-system/assets/106197019/0d40e47c-0f2a-4f02-acc1-d8337a1ce1d0)
![Bottom Page of the Homepage](https://github.com/abcd-arl/forecasting-system/assets/106197019/66f3cffe-f3ec-4a7c-84e3-e7f45ea70885)

![Interface of picking dates to visualize cases within certain range](https://github.com/abcd-arl/forecasting-system/assets/106197019/2f58de99-c521-4f44-85f2-69b2e09fcfcd)

Interface of picking dates to visualize cases within certain range. Defaults to the last twelve months of the available data.

![Interface of the table in the home page](https://github.com/abcd-arl/forecasting-system/assets/106197019/4515add0-8056-4cf6-8c5d-8c149b4f79cf)

The table interface allows users to add new values and create a new forecast. Users can add new values by either clicking on the 'Add' or the 'Upload' button. By clicking on the 'Add' button, new cells in the table are generated for users to fill in, whereas by clicking on the 'Upload' button, users can upload a CSV file that appends its values to the table.

![Interface of the direction for using the table](https://github.com/abcd-arl/forecasting-system/assets/106197019/5ef9f493-1e5b-48bf-b376-7628643cba84)

Users can only make changes to the data that they added. By selecting the 'Select' button, they can simultaneously select cells to edit, insert or delete. Users can also make a separate edit by double-clicking the cell.

![Interface of the direction for uploading CSV file](https://github.com/abcd-arl/forecasting-system/assets/106197019/d5375e40-41af-43be-9abf-6dafb27d1999)

![Interface of the settings with ‘Automatic’ as the selected method](https://github.com/abcd-arl/forecasting-system/assets/106197019/f331bf24-b0da-442d-b8aa-f290d8bbf089)

It provides different options when selecting the parameters for the SARIMA model. Users are able to use the grid search algorithm and change the metric being used to find the best parameters or enter the parameters themselves.

![Interface of the settings with ‘Manual’ as the selected method](https://github.com/abcd-arl/forecasting-system/assets/106197019/4824b205-be77-40ad-a7ec-482b03cd6dc5)

Other than allowing users to enter the parameters themselves. The application also allows users to drop a group of data by selecting the date ranges in the settings. Dropped data will not be included in training the models.

![Login page](https://github.com/abcd-arl/forecasting-system/assets/106197019/c812fa93-8f8c-48d0-a4e8-8c0d0f34b422)

The login interface of the system, which allows the admin to access the admin page.

![Top of the Admin Page](https://github.com/abcd-arl/forecasting-system/assets/106197019/b16839d9-5617-41a1-a32b-15d6bfa3c361)
![Bottom page of the Admin Page](https://github.com/abcd-arl/forecasting-system/assets/106197019/74aacaaa-15d1-4a86-8867-8534fef4522b)
![Interface of the table in the admin page](https://github.com/abcd-arl/forecasting-system/assets/106197019/1e854689-e409-4380-bc09-1af225e56e95)

Similarly, the admin can add data the same way as users, but they can change all the values. When uploading a CSV file, the admin can choose between appending the contents to the table or having the contents replace the table values.



Visit: https://hiv-forecasting-ph-dashboard.web.app/ (backend is not active)
