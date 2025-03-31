import * as React from 'react';
import './userCard.css';

export default function UserCard({ voter }) {
    console.log('voter.image ',voter.image );
    const imageUrl = voter.image 
        ? `http://localhost:5000/uploads/${voter.image}` 
        : '/assets/default-avatar.png'; // Default image if no image available

    return (
        <div className='User-Card'>
            <div className='userImage'>
                <img src={imageUrl} alt='Voter' />
            </div>
            <br />
            <div className='userDetails1'>
                <h6>Name: {voter.firstName} {voter.lastName}</h6>
                <h6>Age: {voter.age}</h6>
                <h6>Phone: {voter.phone}</h6>
                <h6>Voter ID: {voter.voterid}</h6>
                <h6>
    Voter Status:&nbsp;
    {voter.voteStatus === "Voted" ? (
        <span className='Voted'>Voted</span>
    ) : voter.voteStatus === "Not Voted" ? (
        <span className='notVoted'>Not Voted</span>
    ) : (
        <span className='notVoted'>Unknown</span> // Fallback for undefined/null
    )}
</h6>

            </div>
        </div>
    );
}
