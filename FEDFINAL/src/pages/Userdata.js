import React, { useEffect, useState } from "react";
import idb from '../idb';
import PopupGfg from "../components/popup";
import './table.css';
import Popup from 'reactjs-popup';
import "../components/popup.css"
import { MdDelete } from "react-icons/md";
import { IconContext } from 'react-icons';
import MonthYearPicker from "../components/Datesorting";
import { fetchData } from '../components/api.js'; // Import fetchData function from api.js

function Userdata() {
    const [userData, setUserData] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);
    const [clearPopup, setClearPopup] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    useEffect(() => {
        fetchData(selectedMonth, selectedYear)
            .then(setUserData)
            .catch(console.error);
    }, [selectedMonth, selectedYear]);

    const handleMonthYearSelect = (selectedMonth, selectedYear) => {
        setSelectedMonth(selectedMonth);
        setSelectedYear(selectedYear);
    };

    const handlDatabaseClear = async () => {
        try {
            const indexdb = await idb.openCaloriesDB("caloriesdb", 1);
            const transaction = indexdb.transaction("calories", "readwrite");
            const objectStore = transaction.objectStore("calories");
            const clearReq = objectStore.clear();
            clearReq.onsuccess = () => {
                fetchData() // Fetch data after clearing
                    .then(data => {
                        setUserData(data);
                        setClearPopup(true); // Show the clear popup
                        setTimeout(() => {
                            setClearPopup(false); // Close the popup after 2 seconds
                        }, 800);
                    })
                    .catch(console.error);
            };
        } catch (error) {
            console.error('Error opening database for deletion:', error);
        }
    };

    const handleDeleteRow = async (index) => {
        try {
            const indexdb = await idb.openCaloriesDB("caloriesdb", 1);
            const transaction = indexdb.transaction("calories", "readwrite");
            const objectStore = transaction.objectStore("calories");
            const deleteRequest = objectStore.delete(index);
            deleteRequest.onsuccess = () => {
                setUserData(prevData => prevData.filter(row => row.id !== index));
                setDeletePopup(true);
                setTimeout(() => {
                    setDeletePopup(false); // Close the popup after 2 seconds
                }, 800);
            };
            deleteRequest.onerror = console.error;
        } catch (error) {
            console.error('Error opening database for deletion:', error);
        }
    };

    const handleFormSubmit = async () => {
        try {
            const data = await fetchData();
            setUserData(data);
            setShowPopup(true); // Show the popup initially
            setTimeout(() => {
                setShowPopup(false); // Close the popup after 2 seconds
            }, 800);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <React.Fragment>
            <PopupGfg onFormSubmit={handleFormSubmit}/>
            <button type="submit" className="clear-button" onClick={handlDatabaseClear}> ClearDataBase </button>
            <MonthYearPicker onMonthYearSelect={handleMonthYearSelect} />

            <Popup className='pup' open={showPopup}>
                <p> Info was added to the DataBase</p>
            </Popup>
            <Popup className="pup" open={deletePopup}>
                <p>Info Deleted Successfully</p>
            </Popup>
            <Popup className='pup' open={clearPopup}>
                <p> DataBase Cleared</p>
            </Popup>

            <table>
                <thead>
                <tr>
                    <th>Calories</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                {userData.map(data => (
                    <tr key={data.key}>
                        <td>{data.calories}</td>
                        <td>{data.description}</td>
                        <td>{data.category}</td>
                        <td>{`${data.day}/${data.month}/${data.year}`}</td>
                        <td>
                            <IconContext.Provider value={{color: '#0b0a0a', size: '35px'}}>
                                <MdDelete onClick={() => handleDeleteRow(data.id)}/>
                            </IconContext.Provider>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </React.Fragment>
    );
}

export default Userdata;
