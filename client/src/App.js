import React, { Component } from "react";
import getWeb3 from "./getWeb3";
import Header from "./components/Header";
import SupplyForm from "./components/SupplyForm";
import Track from "./components/TrackForm";
import AddProduct from "./components/AddProduct";
import FinancialLog from "./components/FinancialLog";
import BankAccounts from "./components/BankAccounts";
import PharmaChainContract from "./contracts/PharmaChain.json";
import PharmaChainTrackingContract from "./contracts/PharmaChainTracking.json";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import "./App.css";

class ConfigureContracts extends Component {
  state = { contractsConfigured: false };

  componentDidMount = async () => {
    try {
      const conf = await this.props.pctContract.methods
        .setContract(this.props.contAddr)
        .send({ from: this.props.account[0] });

      // const bank = await this.prop.pcContract.methods
      // .setBank(this.props.account[])
      this.setState({ conf, contractsConfigured: true });
      localStorage.setItem(
        "contractToken1",
        this.state.contractsConfigured
      );
      const persistStatus = localStorage.getItem("contractToken1");
      this.setState({ contractsConfigured: persistStatus });
      this.props.setData(this.state.contractsConfigured);
    } catch (error) {
      alert(
        "Unexpected error occurred while trying to setup Dapp data, please refresh the page and try again."
      );
    }
  };

  render() {
    return (
      <div
        style={{
          color: "#f2f2f2",
          backgroundColor: "#295263",
          height: "100vh",
          textAlign: "center",
          margin: "0px auto",
          padding: "10px",
        }}
      >
        <div className="animated-config">SETTING UP NECESSARY DAPP DATA</div>
        <p className="animated-config-subtext">
          Confirm MetaMask's Pop-up Notification(s) to Continue.
        </p>
      </div>
    );
  }
}



class ConfigureContracts2 extends Component {
  state = { contractsConfigured: false };

  componentDidMount = async () => {
    try {
      const bank = await this.props.pcContract.methods
        .setAsBank(this.props.account[0])
        .send({ from: this.props.account[0] });

      
      this.setState({ bank, contractsConfigured: true });
      localStorage.setItem(
        "contractToken2",
        this.state.contractsConfigured
      );
      const persistStatus = localStorage.getItem("contractToken2");
      this.setState({ contractsConfigured: persistStatus });
      this.props.setData(this.state.contractsConfigured);
    } catch (error) {
      alert(
        "Unexpected error occurred while trying to setup Dapp data, please refresh the page and try again."
      );
    }
  };

  

  render() {
    return (
      <div
        style={{
          color: "#f2f2f2",
          backgroundColor: "#295263",
          height: "100vh",
          textAlign: "center",
          margin: "0px auto",
          padding: "10px",
        }}
      >
        <div className="animated-config">FINISHING DAPP SETUP</div>
        <p className="animated-config-subtext">
          Confirm MetaMask's Pop-up Notification(s) to Continue.
        </p>
      </div>
    );
  }
}


class Loader extends Component {
  render() {
    return (
      <div>
        <div
          style={{
            backgroundColor: "white",
            height: "100vh",
            textAlign: "center",
            margin: "0px auto",
            padding: "10px",
          }}
        >
          <img
            style={{ marginTop: "10%" }}
            src={require("./assets/imgs/spinner.gif")}
            alt="loading"
          />
        </div>
        ;
      </div>
    );
  }
}

class MainMsg extends Component {
  render() {
    return (
      <div className="main-msg">
        WELCOME TO <br></br> PHARMA CHAIN <br></br> HOMEPAGE
      </div>
    );
  }
}

class App extends Component {
  // state = { storageValue: 0, web3: null, accounts: null, contract: null };
  state = {
    web3: null,
    accounts: null,
    contract: null,
    isMenuToggled: false,
    contractsConfigured: false,
    contractsConfigured2: false,
    notifyVisible: true,
  };

  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.collapseMenu = this.collapseMenu.bind(this);
  }

  getContractStatus = (state) => {
    this.setState({ contractsConfigured: state });
    console.log(this.state.contractsConfigured);
  };
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork1 = PharmaChainContract.networks[networkId];
      this.setState({oldData1: deployedNetwork1.address}) 
      localStorage.setItem(
        "oldDataCheck1",
        this.state.oldData1
      );
      const deployedNetwork2 = PharmaChainTrackingContract.networks[networkId];
      this.setState({oldData2: deployedNetwork2.address}) 
      localStorage.setItem(
        "oldDataCheck2",
        this.state.oldData2
      );
      const pcInstance = new web3.eth.Contract(
        PharmaChainContract.abi,
        deployedNetwork1 && deployedNetwork1.address
      );
     
      const pctInstance = new web3.eth.Contract(
        PharmaChainTrackingContract.abi,
        deployedNetwork2 && deployedNetwork2.address
      );

      const cont1Addr = await pcInstance.methods.returnContractAddress().call();
      console.log(cont1Addr, deployedNetwork1.address)
      localStorage.setItem('cont1Old',cont1Addr );
      const test = localStorage.getItem('cont1Old');
      console.log(test);
      // const check1 = localStorage.getItem("oldDataCheck1")
      // const check2 = localStorage.getItem("oldDataCheck2")
      //  console.log(check1, deployedNetwork1.address);
      //  console.log(check2, deployedNetwork2.address);

      
     
      // Set web3, accounts, and contract to the state

      const balance = await pcInstance.methods.getBalance(accounts[0]).call();
      this.setState({
        web3,
        accounts,
        balance,
        pcContract: pcInstance,
        pctContract: pctInstance,
        addr: deployedNetwork1.address,
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      
      alert(
        `Failed to load Web3. Please check your web3 connection and try again!`
      );
    }
  };

  collapseMenu() {
    setTimeout(() => {
      this.setState({ isMenuToggled: false });
    }, 200);
  }

  toggleMenu() {
    this.setState({ isMenuToggled: !this.state.isMenuToggled });
  }

  render() {
    if (!this.state.web3) {
      return <Loader />;
    }
    if (!localStorage.getItem("contractToken1")) {
      return (
        <ConfigureContracts
          Web3={this.state.web3}
          account={this.state.accounts}
          pcContract={this.state.pcContract}
          pctContract={this.state.pctContract}
          contAddr={this.state.addr}
          setData={this.getContractStatus}
        />
      );
    }
    if ( localStorage.getItem("contractToken1") && !localStorage.getItem("contractToken2")) {
      return (
        <ConfigureContracts2
          Web3={this.state.web3}
          account={this.state.accounts}
          pcContract={this.state.pcContract}
          pctContract={this.state.pctContract}
          contAddr={this.state.addr}
          setData={this.getContractStatus}
        />
      );
    }

    let toggle;
    this.state.isMenuToggled ? (toggle = "") : (toggle = "hide");
    return (
      <BrowserRouter>
        <div className="App">
          <Header accounts={this.state.accounts} balance={this.state.balance} />
          <div className="navbar-container">
            <button onClick={this.toggleMenu} className="responsive-menu">
              <img
                alt="hamburger-menu"
                width="25px"
                src={require("../src/assets/imgs/hamburger-menu.svg")}
              />
            </button>
            <ul id="my-nav" className={`nav-list ${toggle}`}>
              <li className="nav-item">
                <NavLink onClick={this.collapseMenu} to="/add-product">
                  PRODUCT MANAGEMENT
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink onClick={this.collapseMenu} to="/supply">
                  SUPPLY MANAGEMENT
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink onClick={this.collapseMenu} to="/track">
                  TRACKING
                </NavLink>
              </li>
              <li className="nav-item">
                {/* <NavLink onClick={this.collapseMenu} to="/inventory">VIEW INVENTORY</NavLink>
              </li>
              <li className="nav-item"> */}

                <NavLink onClick={this.collapseMenu} to="/financial-log">
                  COST MANAGEMENT
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink onClick={this.collapseMenu} to="/bank-account">
                  BANK ACCOUNT MANAGEMENT
                </NavLink>
              </li>
            </ul>
          </div>
          <Route path="/" exact component={MainMsg} />
          <Route
            path="/supply"
            render={(props) => (
              <SupplyForm
                {...props}
                Web3={this.state.web3}
                account={this.state.accounts}
                pcContract={this.state.pcContract}
                pctContract={this.state.pctContract}
              />
            )}
          />

          <Route
            path="/track"
            // exact
            render={(props) => (
              <Track
                {...props}
                Web3={this.state.web3}
                account={this.state.accounts}
                pcContract={this.state.pcContract}
                pctContract={this.state.pctContract}
              />
            )}
          />
          <Route
            path="/add-product"
            render={(props) => (
              <AddProduct
                {...props}
                accounts={this.state.accounts}
                pcContract={this.state.pcContract}
                pctContract={this.state.pctContract}
              />
            )}
          />
          <Route
            path="/financial-log"
            exact
            render={(props) => (
              <FinancialLog
                {...props}
                accounts={this.state.accounts}
                web3={this.state.web3}
                pcContract={this.state.pcContract}
                pctContract={this.state.pctContract}
              />
            )}
          />
          <Route
            path="/bank-account"
            render={(props) => (
              <BankAccounts
                {...props}
                accounts={this.state.accounts}
                pcContract={this.state.pcContract}
                pctContract={this.state.pctContract}
                web3={this.state.web3}
              />
            )}
          />
          <div> {this.state.response} </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
