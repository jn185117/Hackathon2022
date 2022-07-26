import {React, useState} from 'react'
import styles from './Wallet.module.css';

const Interactions = (props) => {

	const [transferHash, setTransferHash] = useState();
	const [userAccount, setuserAccount] = useState();



	const transferHandler = async (e) => {
		e.preventDefault();
		let transferAmount = e.target.sendAmount.value;
		let recieverAddress = e.target.recieverAddress.value;

		let txt = await props.contract.transfer(recieverAddress, transferAmount);
		console.log(txt);
		setuserAccount(props.account);
		setTransferHash("Transaction confirmed. Check you wallet to see history");
		console.log('users account is '+props.account)
		console.log('users points to transfer '+ transferAmount)
		e.target.sendAmount.value = ''
		window.open("http://google.com");

		


		setTimeout(function () {
			
			window.location.reload(true);
		  }, 15000);
		

		
		
	}



	return (
			<div className={styles.interactionsCard}>
				<form onSubmit={transferHandler}>
					<h3> Transfer Loyalty Points </h3>
					
						<p>Address to send points</p>
						
						<input type='text' id='recieverAddress' className={styles.addressInput}/>

						<p> Number of Points </p>
						<input type='number' id='sendAmount' min='0' step='1' />

						<button type='submit' className={styles.button6}>Send</button>
						<div>
							{transferHash}
							
						</div>
			</form>
			</div>
		)
	
}

export default Interactions;