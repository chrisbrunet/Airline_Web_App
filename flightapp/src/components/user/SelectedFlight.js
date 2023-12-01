import React, { useState, useEffect } from 'react';
import '../css/styles.css';
import styled from 'styled-components';
import axios from 'axios';

import { useNavigate, useParams } from 'react-router-dom';

const StyledTable = styled.table`
  border-collapse: collapse;
  margin-top: 20px;
`;

const StyledTableCell = styled.td`
  border: 1px solid #000;
  width: 10px;
  height: 10px;
  text-align: center;
  cursor: pointer;
  font-size: 12px;

  &.selected {
    background-color: #007bff;
    color: #fff;
  }
`;

const SelectedFlight = () => {

    const navigate = useNavigate();
    const handleHomeButton = () => {
        navigate('/Home');
    };

    const { flightID } = useParams();

    const getFlightInfo = (flightID) => {
        console.log(flightID);
        axios.get(`http://localhost:3001/api/search_flights_by_id`, 
        {params: {
            flightID: flightID
          }
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.error("Error fetching flight details:", error);
        });
    };

    useEffect(() => {
       getFlightInfo(flightID);
    }, [flightID]);

    const [selectedSeatIds, setSelectedSeatIds] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [cancellationInsurance, setCancellationInsurance] = useState(false);

    const toggleSeat = (seatId) => {
        if (!seatId.includes('aisle')) {
            setSelectedSeatIds((prevSelectedSeatIds) => {
                if (prevSelectedSeatIds.includes(seatId)) {
                    return prevSelectedSeatIds.filter((id) => id !== seatId);
                } else {
                    return [...prevSelectedSeatIds, seatId];
                }
            });
        }
    };

    const updateSelectedSeatsList = () => {
        return selectedSeatIds.map((seatId) => (
            <li key={seatId}>{seatId}</li>
        ));
    };

    const calculateTotalPrice = () => {
        let newTotalPrice = selectedSeatIds.length * 250;

        if (cancellationInsurance) {
            newTotalPrice += 50;
        }

        setTotalPrice(newTotalPrice);
    };

    const handleCancellationInsuranceChange = () => {
        setCancellationInsurance((prevCancellationInsurance) => !prevCancellationInsurance);
        calculateTotalPrice();
    };

    const seatTableBody = [];
    for (let i = 1; i <= 20; i++) {
        const row = [];

        for (let j = 1; j <= 7; j++) {
            if (j === 4) {
                row.push(<StyledTableCell key={`row${i}col${j}`} className="aisle"></StyledTableCell>);
            } else {
                const seatId = `Seat ${i + String.fromCharCode(64 + j - (j > 4 ? 2 : 0))}`;
                row.push(
                    <StyledTableCell
                        key={`row${i}col${j}`}
                        onClick={() => toggleSeat(seatId)}
                        className={selectedSeatIds.includes(seatId) ? 'selected' : ''}
                    >
                        {seatId}
                    </StyledTableCell>
                );
            }
        }

        seatTableBody.push(<tr key={`row${i}`}>{row}</tr>);
    }

    return (
        <div>
            <div className="navbar">
                <h1>Flight ####</h1>
                <button onClick={handleHomeButton} className="btn">
                    Home
                </button>
            </div>
            <div className="card">
                <h2>Select Seats</h2>
                <div className="flex-container">
                    <div className="seat-map">
                        <StyledTable id="seatTable">
                            <tbody id="seatTableBody">{seatTableBody}</tbody>
                        </StyledTable>
                    </div>
                    <div className="selected-seats">
                        <h3>Selected Seats</h3>
                        <ul id="selectedSeatsList">{updateSelectedSeatsList()}</ul>
                        <div className="cancellation-insurance">
                            <input
                                type="checkbox"
                                id="cancellationInsurance"
                                checked={cancellationInsurance}
                                onChange={handleCancellationInsuranceChange}
                            />
                            <label htmlFor="cancellationInsurance">Cancellation Insurance (+$50)</label>
                        </div>
                        <div className="total-price">
                            Total Price: $<span id="totalPrice">{totalPrice}</span>
                        </div>
                        <h3>Payment Details</h3>
                        <form>
                            <div class="input-group">
                                <label for="cardNo">Name on Card:</label>
                                <input type="text" id="cardNO" name="cardNO" required />
                            </div>
                            <div class="input-group">
                                <label for="cardNo">Credit Card Number:</label>
                                <input type="text" id="cardNO" name="cardNO" required />
                            </div>
                            <div class="input-group">
                                <label for="arrivalAirport">Expiry Date:</label>
                                <input type="text" id="expDate" name="expDate" required />
                            </div>
                            <div class="input-group">
                                <label for="date">CVC</label>
                                <input type="text" id="cvc" name="cvc" required />
                            </div>
                            <div class="input-group">
                                <label for="date">Email:</label>
                                <input type="text" id="email" name="email" required />
                            </div>
                            <button class="submit">Confirm and Pay</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectedFlight;