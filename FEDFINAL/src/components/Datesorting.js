import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './popup.css';
import idb from '../idb';
import { fetchData } from './api.js'; // Import fetchData function from api.js

function MonthYearPicker({ onMonthYearSelect }) {
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    useEffect(() => {
        // Initialize selectedYear to the current year when component mounts
        const currentYear = new Date().getFullYear();
        setSelectedYear(currentYear);
    }, []);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const generateYears = () => {
        const years = [];
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= currentYear - 10; year--) {
            years.push(year);
        }
        return years.map(year => <option key={year} value={year}>{year}</option>);
    };

    const handleSubmit = async (close) => {
        try {
            // Fetch data for the selected year and month from the database
            const data = await fetchData(selectedMonth, selectedYear);

            // Check if data exists for the selected year and month
            if (data.length > 0) {
                // Data exists, proceed with selection
                onMonthYearSelect(selectedMonth, selectedYear);
                setSelectedMonth('');
                setSelectedYear('');
                close(); // Close the popup after submission
            } else {
                // Data doesn't exist for the selected year and month
                console.error('No data found for the selected month and year. Please select a valid month and year.');
                // Optionally, display an error message to the user
            }
        } catch (error) {
            // Handle error (e.g., display error message to the user)
            console.error('Error opening database or fetching data:', error);
            // Optionally, display an error message to the user
        }
    };

    return (
        <Popup className='pup' trigger={<button className='year-month-button'>Select Month and Year</button>} modal nested>
            {close => (
                <div className='modal'>
                    <div className='content'>
                        <div className="addcalorie">
                            <div className="row">
                                <div className="col-md-12">
                                    <h5 className="mt-2">Select Month and Year</h5>
                                    <form>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-lable">Month:</label>
                                                    <select className="form-control" value={selectedMonth} onChange={handleMonthChange}>
                                                        <option value="">Select Month</option>
                                                        <option value="1">January</option>
                                                        <option value="2">February</option>
                                                        <option value="3">March</option>
                                                        <option value="4">April</option>
                                                        <option value="5">May</option>
                                                        <option value="6">June</option>
                                                        <option value="7">July</option>
                                                        <option value="8">August</option>
                                                        <option value="9">September</option>
                                                        <option value="10">October</option>
                                                        <option value="11">November</option>
                                                        <option value="12">December</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-lable">Year:</label>
                                                    <select className="form-control" value={selectedYear} onChange={handleYearChange}>
                                                        <option value="">Select Year</option>
                                                        {generateYears()}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="mb-3">
                                                    <button type="button" className="btn btn-success btn-lg" onClick={() => handleSubmit(close)}>Submit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Popup>
    );
}

export default MonthYearPicker;
