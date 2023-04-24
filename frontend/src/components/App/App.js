import { createContext, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './App.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import HomePage from '../HomePage/HomePage';
import AdminPage from '../AdminPage/AdminPage';
import LoginForm from '../LoginForm/LoginForm';
import UseTableData from '../UseTableData/UseTableData';
import Error from '../Error/Error';

export const HomeContext = createContext();
export const AdminContext = createContext();

function App() {
	const [homeTableReducer, homeChartsState, homeModelSettings] = [UseTableData(), useState(), useState()];
	const [adminTableReducer, adminChartsState, adminModelSettings] = [UseTableData(), useState(), useState()];
	const [isTableUpdated, setIsTableUpdated] = useState(false);

	return (
		<>
			<div className="w-full my-4">
				<div className="w-[96%] h-full mx-auto">
					<div className="w-full h-full max-w-[1280px] mx-auto">
						<Header />
						<main className="min-h-[calc(100vh_-_330px)] md:min-h-[calc(100vh_-_300px)] post-lg:min-h-[calc(100vh_-_260px)] relative flex justify-center items-center">
							<div className="w-full">
								<Error />
								{/* <HomeContext.Provider
									value={{ homeTableReducer, homeChartsState, isTableUpdated, setIsTableUpdated, homeModelSettings }}
								>
									<Routes>
										<Route
											path="/"
											element={
												<>
													<Helmet>
														{<title>Dashboard | Time Series Forecastng of HIV Cases in the Philippines</title>}
													</Helmet>
													<HomePage />
												</>
											}
										/>
										<Route
											path="/admin"
											element={
												<AdminContext.Provider
													value={{
														adminTableReducer,
														adminChartsState,
														isTableUpdated,
														setIsTableUpdated,
														adminModelSettings,
													}}
												>
													<Helmet>
														{<title>Admin | Time Series Forecastng of HIV Cases in the Philippines</title>}
													</Helmet>
													<AdminPage />
												</AdminContext.Provider>
											}
										/>
										<Route
											path="/login"
											element={
												<>
													<Helmet>
														{<title>Login | Time Series Forecastng of HIV Cases in the Philippines</title>}
													</Helmet>
													<LoginForm />
												</>
											}
										/>
									</Routes>
								</HomeContext.Provider> */}
							</div>
						</main>
						<Footer />
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
