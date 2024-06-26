import React, {useEffect, useState} from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './popup.css';
import idb from '../idb.js';
 import { fetchData } from '../pages/Userdata';

export default function PopupGfg({ onFormSubmit })
{
    const [formValue, setFormValue] = useState({calories: '', description: '', category: 'Breakfast'});
    const [errormessage, seterrorMessage] = useState(
        {
            calories:'',description: ''
        }
    );


    const handleInput = (e) => {
        const {name, value} = e.target;
        setFormValue({...formValue, [name]: value});

    }

    const handleSubmit = async (e,close) => {
        e.preventDefault();


        const allInputvalue = {
            calories: formValue.calories,
            description: formValue.description,
            category: formValue.category
        }
        try {
            const indexdb = await idb.openCaloriesDB("caloriesdb", 1);
               await indexdb.addCalories(allInputvalue);
            setFormValue({
                    calories: '', description: '', category: 'Breakfast'
                }
            );
            onFormSubmit();//update table
            close(); // Close the popup after submission

        } catch (error) {
            console.error('Error adding data to IndexedDB:', error);
        }
    }


        return (
            <div>
                <Popup className='pup' trigger={<button className='new-cal-button'>Add a new Calorie</button>} modal nested>
                    {close => (
                        <div className='modal'>
                            <div className='content'>
                                <div className="addcalorie">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <h5 className="mt-2">Add A New Calorie input</h5>
                                            <p className="text-success">  </p>
                                            <form onSubmit={(e) => handleSubmit(e, close)}>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="mb-3">
                                                            <label className="form-lable">Please Enter the amount of Calories:</label>
                                                            <input  type="number" name="calories" className="form-control"
                                                                   value={formValue.calories} onChange={handleInput}
                                                                    min={1}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="mb-3">
                                                            <label className="form-lable">Please Enter a Small Description:</label>
                                                            <input type="text" name="description" className="form-control"
                                                                   required
                                                                   pattern=".*\S+.*"
                                                                   value={formValue.description} onChange={handleInput} />

                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="mb-3">
                                                            <label className="form-lable">Pick Category</label>
                                                            <select className="form-control" name="category" value={formValue.category}
                                                                    onChange={handleInput}>
                                                                <option value="Breakfast">Breakfast</option>
                                                                <option value="Lunch">Lunch</option>
                                                                <option value="Dinner">Dinner</option>
                                                                <option value="Other">Other</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <div className="mb-3">
                                                            <button type="submit" className="btn btn-success btn-lg">Submit</button>
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
            </div>
        );
}