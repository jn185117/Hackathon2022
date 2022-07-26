import {React, useState, useEffect} from 'react'
import {ethers} from 'ethers'
import styles from './Wallet.module.css'
import simple_token_abi from './Contracts/simple_token_abi.json'
import Interactions from './Interactions';

const Wallet = () => {

	// deploy simple token contract and paste deployed contract address here. This value is local ganache chain
	let contractAddress = '0x7176067e75b09925dF58577dD33982d7B3343221';

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);

	const [tokenName, setTokenName] = useState("Token");
	const [balance, setBalance] = useState(null);
	const [transferHash, setTransferHash] = useState(null);
	const [conversion, setConversion] = useState(null);
	const [amount, setAmount] = useState(null);



	const connectWalletHandler = async() => {

		let provider = new ethers.providers.Web3Provider(window.ethereum);
		let accounts = await provider.send("eth_requestAccounts",[]);

		if (accounts.length>0){
			console.log('Already connected')
		}

		if (accounts.length>0 || (window.ethereum && window.ethereum.isMetaMask)) {

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		updateEthers();
	}

	const updateBalance = async () => {
		
		let balanceBigN = await contract.balanceOf(defaultAccount);
		let balanceNumber = balanceBigN.toNumber();

		let tokenDecimals = await contract.decimals();

		let tokenBalance = balanceNumber / Math.pow(10, tokenDecimals);

		setBalance(balanceNumber);	
		console.log('updating balance' +balanceNumber)


	}

   function toFixed(x) {
   if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split('e-')[1]);
      if (e) {
         x *= Math.pow(10, e - 1);
         x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
   } else {
      var e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
         e -= 20;
         x /= Math.pow(10, e);
         x += (new Array(e + 1)).join('0');
      }
   }
   return x;
}

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}

	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);

	const updateEthers = () => {
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(tempProvider);

		let tempSigner = tempProvider.getSigner();
		setSigner(tempSigner);

		let tempContract = new ethers.Contract(contractAddress, simple_token_abi, tempSigner);
		setContract(tempContract);	
	}

	

	useEffect(() => {
		if (contract != null) {
			updateBalance();
			updateTokenName();
		}
	}, [contract]);

	const updateTokenName = async () => {
		setTokenName(await contract.name());
	}

	useEffect(()=> {

		const queryParams = new URLSearchParams(window.location.search)
  		const conversion = queryParams.get("conversion")
		const amount = queryParams.get("amount")
  		console.log(conversion)
		console.log(amount)
		setConversion(conversion);
		setAmount(amount);

		connectWalletHandler()
		updateBalance();
		
		
		} ,[])
	
	return (
	<div>
			<h2 className={styles.greenText}> {"NCR Smart Loyalty Connect"} </h2>
			<button className={styles.button6} onClick={connectWalletHandler}>{connButtonText}</button>

			<div className={styles.walletCard}>
			<div>
				<h3>Your Address: {defaultAccount}</h3>
			</div>

			<div>
				<h3>{"NCR Smart Loyalty "} Balance: {balance}</h3>
			</div>
			<div> <h5> 1 NCR Loyalty Point = {conversion}$</h5></div>
			<div> <h5>Total amount Payable = {amount}$</h5> </div>

			{errorMessage}
		</div>
		<div></div>
		<Interactions contract = {contract} account = {defaultAccount} updateAfterBalance = {updateBalance}/>
	</div>
	)
}

export default Wallet;