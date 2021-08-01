import React, { Component } from "react";
import { BrowserRouter, Route, NavLink } from "react-router-dom";


class ReviewStdCostSheet extends Component {
  state = { id: "", tableVisibility: false };

  constructor(props) {
    super(props);
    this.productIdRef = React.createRef();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount = async () => {
    const isTrust = await this.props.pcContract.methods.isTrusted(this.props.account[0]).call();
    this.setState({ isTrust });

    // const products = await this.props.pcContract.methods.getProductsByManu(this.props.account[0]).call();

    // const isOwner = products.map(item => {
    //   if(item.manufacturer === this.props.account[0]) {
    //   return true;
    // } else {
    //   return false;
    // }
    // })
    // const strBoolIsOwner = isOwner.toString();
    // this.setState({strBoolIsOwner})
  }
  onSubmit = async (e) => {
    e.preventDefault();
    const proId = this.state.id;

    const standard = await this.props.pcContract.methods
      .getStdCostPlan(proId)
      .call();
    console.log(standard);
    const stdCostData = standard.map((item, index) => {
      let matStdCostValue = parseFloat(standard.directMaterialCost, 10);
      let pkgStdCostValue = parseFloat(standard.packagingMaterialCost, 10);
      let laborStdCostValue = parseFloat(standard.directLaborCost, 10);
      let totalDirectStdCostValue = parseFloat(standard.totalDirectCost, 10);
      let totalStdCostValue = parseFloat(standard.CostTOT, 10);
      let mrkStdCostValue = totalDirectStdCostValue * 15 / 100;
      let rsrchStdCostValue = totalDirectStdCostValue * 3 / 100;
      let totalIndirectCostValue = totalDirectStdCostValue * 20 / 100;
      let FundManuCostValue = totalDirectStdCostValue * 30 / 100;

      let matStdCost = matStdCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let pkgStdCost = pkgStdCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let laborStdCost = laborStdCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let mrkStdCost = mrkStdCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let rsrchStdCost = rsrchStdCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let totalStdCost = totalStdCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let totalIndirectCost = totalIndirectCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let FundManuCost = FundManuCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let totalDirectStdCost = totalDirectStdCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      console.log(
        matStdCost,
        pkgStdCost,
        laborStdCost,
        mrkStdCost,
        rsrchStdCost,
        totalStdCost,
        totalIndirectCost,
        FundManuCost,
        totalDirectStdCost,
        matStdCostValue,
        pkgStdCostValue,
        laborStdCostValue,
        mrkStdCostValue,
        rsrchStdCostValue,
        totalStdCostValue,
        totalIndirectCostValue,
        FundManuCostValue,
        totalDirectStdCostValue)

      this.setState({
        standard,
        matStdCost,
        pkgStdCost,
        laborStdCost,
        mrkStdCost,
        rsrchStdCost,
        totalStdCost,
        totalIndirectCost,
        FundManuCost,
        totalDirectStdCost,
        matStdCostValue,
        pkgStdCostValue,
        laborStdCostValue,
        mrkStdCostValue,
        rsrchStdCostValue,
        totalStdCostValue,
        totalIndirectCostValue,
        FundManuCostValue,
        totalDirectStdCostValue
      });
      return true;
    });
    const productSpecsAll = await this.props.pcContract.methods.getProductSpecs(proId).call();
    console.log(productSpecsAll);
    const productCostSingle = productSpecsAll.map((spec, index) => {
      const materialName = spec.materialName;
      const materialCost = spec.materialUnitCost;
      const amountMg = spec.materialAmount
      const amountKg = amountMg / 1000000; // convert from mg to kg to get cost per kg
      const matCost = materialCost * amountKg;
      console.log(matCost);
      const materialCostStr = matCost.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });


      return (
        <tr key={index}>
          <td>{materialName}</td>
          <td>{materialCostStr}</td>
        </tr>
      );
    })

    this.setState({ productCostSingle })
    if (this.state.totalStdCostValue === 0 || isNaN(this.state.totalStdCostValue)) {
      this.setState({
        msg: "No Financial Data Found for the Given Product ID!".toUpperCase(),
      });
      this.setState({ tableVisibility: false });
    } else {
      this.setState({ tableVisibility: true });
    }

    setTimeout(() => {
      this.setState({ msg: " " });
    }, 3000);
    this.setState({ stdCostData });
  };

  onChange = async (e) => {
    this.setState({
      id: this.productIdRef.current.value,
    });

    const products = await this.props.pcContract.methods.getProductsByManu(this.props.account[0]).call();
    const product = products.filter(item => {
      return item.productName === this.state.id;
    })

    const isOwner = product.map(item => {
      if (item.manufacturer === this.props.account[0]) {
        return true;
      } else {
        return false;
      }
    })
    const strBoolIsOwner = isOwner.toString();
    this.setState({ strBoolIsOwner, tableVisibility: false })


  };
  render() {
    let classified, table;
    if (this.state.isTrust || this.state.strBoolIsOwner === 'true') {
      classified = "show"
    } else {
      classified = "hide"
    };
    let acc = this.props.account;
    let cont1 = this.props.pcContract;
    let cont2 = this.props.pctContract;
    let web3 = this.props.Web3;

    if (!acc || !cont1 || !cont2 || !web3) {
      return <div> Loading..... </div>;
    }
    this.state.tableVisibility ? (table = "show") : (table = "hide");
    return (
      <div className="financial-status-container">
        <form onSubmit={this.onSubmit} className="form-container">
          <div className="form-row">
            <h4>Review Cost Sheet</h4>
            <label style={{ marginRight: "5px" }}> Product ID: </label>
            <input
              type="text"
              placeholder="e.g. pro101"
              value={this.state.id}
              onChange={this.onChange}
              ref={this.productIdRef}
              required="required"
            />
            <div>
              <input
                style={{ cursor: "pointer" }}
                type="submit"
                className="btn"
                value="VIEW STANDARD COST SHEET"
              />
            </div>
          </div>
          <div className="query-result">
            <p> {this.state.msg} </p>
          </div>
          <div className={`${table} costsClashContainer `}>
            <div className="std-cost-container">
              <table className="cost-data">
                <thead>
                  <tr>
                    <th>CRITERIA</th>
                    <th>COST</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #999' }}> <th colspan='2'>Raw Material Details</th></tr>
                  {this.state.productCostSingle}
                  <tr style={{ borderTop: '1px solid #999' }}>
                    <td > Raw Materials Total </td>
                    <td>{this.state.matStdCost}</td>
                  </tr>
                  <tr>
                    <td> Packaging Materials </td>
                    <td>{this.state.pkgStdCost}</td>
                  </tr>
                  <tr>
                    <td> Direct Labor </td>
                    <td>{this.state.laborStdCost}</td>
                  </tr>
                  <tr
                    style={{
                      borderTop: "1px solid",
                      borderBottom: "1px solid",
                    }}
                  >
                    <th>TOTAL DIRECT COST</th>
                    <td>{this.state.totalDirectStdCost}</td>
                  </tr>
                  <tr className={`${classified}`}>
                    <td> Indirect Manufacturing Costs (20%) </td>
                    <td>{this.state.totalIndirectCost}</td>
                  </tr>
                  <tr className={`${classified}`}>
                    <td> Managerial and Funding Costs (30%) </td>
                    <td>{this.state.FundManuCost}</td>
                  </tr>
                  {/* <tr className={`${classified}`}>
                    <td> Value Added Tax (14%) </td>
                    <td>{(totDirValue * 14 / 100).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}</td>
                  </tr> */}
                  <tr className={`${classified}`} >
                    <td> Marketing (15%)</td>
                    <td>{this.state.mrkStdCost}</td>
                  </tr>
                  <tr className={`${classified}`}>
                    <td> Research (3%)</td>
                    <td>{this.state.rsrchStdCost}</td>
                  </tr>
                </tbody>

                <tfoot className={`${classified}`}>
                  <tr>
                    <th> TOTAL </th>
                    <td>{this.state.totalStdCost} </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

class ReviewActCostSheet extends Component {
  state = { id: "", tableVisibility: false, requested: [] };

  constructor(props) {
    super(props);
    this.productIdRef = React.createRef();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount = async () => {
    const isTrust = await this.props.pcContract.methods.isTrusted(this.props.account[0]).call();
    this.setState({ isTrust });

    const products = await this.props.pcContract.methods.getProductsByManu(this.props.account[0]).call();
    const isOwner = products.map(item => {
      if (item.manufacturer === this.props.account[0]) {
        return true;
      } else {
        return false;
      }
    })
    const strBoolIsOwner = isOwner.toString()
    this.setState({ strBoolIsOwner })
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const proId = this.state.id;

    const actual = await this.props.pcContract.methods
      .getActualCost(proId)
      .call();

    console.log(actual)

    const actualCostData = actual.map((item, index) => {
      let matActCostValue = parseFloat(actual.directMaterialCost, 10);
      console.log(matActCostValue);
      let pkgActCostValue = parseFloat(actual.packagingMaterialCost, 10);
      let laborActCostValue = parseFloat(actual.directLaborCost, 10);
      let totalDirectCostValue = matActCostValue + pkgActCostValue + laborActCostValue;
      let totalActCostValue = parseFloat(actual.CostTOT, 10);
      let mrkActCostValue = totalDirectCostValue * 15 / 100;
      let rsrchActCostValue = totalDirectCostValue * 3 / 100;
      let totalIndirectCostValue = totalDirectCostValue * 20 / 100;
      let fundManuCostValue = totalDirectCostValue * 30 / 100;
      // // let totalActCostValue = parseInt(actual.CostTOT,10);
      // let totalActCostValue =
      //   matActCostValue +
      //   pkgActCostValue +
      //   laborActCostValue +
      //   mrkActCostValue +
      //   rsrchActCostValue;

      let matActCost = matActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let pkgActCost = pkgActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let laborActCost = laborActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let totalDirectCost = totalDirectCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let mrkActCost = mrkActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let rsrchActCost = rsrchActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let totalActCost = totalActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      let totalIndirectCost = totalIndirectCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      let fundManuCost = fundManuCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });


      this.setState({
        actual,
        matActCost,
        pkgActCost,
        laborActCost,
        mrkActCost,
        rsrchActCost,
        totalActCost,
        totalDirectCost,
        totalIndirectCost,
        fundManuCost,
        matActCostValue,
        pkgActCostValue,
        laborActCostValue,
        mrkActCostValue,
        rsrchActCostValue,
        totalActCostValue,
        totalDirectCostValue,
        totalIndirectCostValue,
        fundManuCostValue

      });
      return true;
    });

    const requests = await this.props.pcContract.methods.getMyRequests().call();
    const matRequested = requests.map(request => {
      let id = request.materialID;
      let matRequests = [...this.state.requested, id]
      this.setState({ requested: matRequests })
      return matRequests[matRequests.length - 1];
    })
    console.log(requests)
    if (requests.length === 0) {
      this.setState({
        msg: "No Financial Data Found for the Given Product ID!".toUpperCase(),
      });
      setTimeout(() => {
        this.setState({ msg: " " });
      }, 3000);
    }

    const info = await this.props.pcContract.methods.getMaterials().call();

    const infoFiltered = info.filter(mat => {
      // based on: const found = arr1.some(r=> arr2.includes(r))
      // checks if an array contains values from another array
      return mat.some(r => matRequested.includes(r));
      //return mat.includes('mat01')

    })

    const names = infoFiltered.map((mat, index) => {
      let name = mat.materialName;
      return (
        <table>
          <tr key={index}>
            <td style={{ padding: '8px 0px' }}> {name} </td>
          </tr>
        </table>
      );
    })

    this.setState({ names })


    const materialCosts = infoFiltered.map(mat => {
      const matCost = mat.unitCost;
      const matCostValue = parseFloat(matCost);
      // if (mat.materialType === 'active' || mat.materialType === 'support') {

      // } else {
      //   return 0;
      // }
      return matCostValue;

    })



    // const pkgCosts = infoFiltered.map(mat => {
    //   const matCost = mat.unitCost;
    //   const matCostValue = parseFloat(matCost);
    //   if (mat.materialType === 'packaging') {
    //     return matCostValue;
    //     } else {
    //       return 0;
    //     }
    // })

    this.setState({ materialCosts })

    const productSpecsInfo = await this.props.pcContract.methods.getProductSpecs(proId).call();
    const productSpecs = productSpecsInfo.map(spec => {
      let name = spec.materialName;
      this.setState({ name })
      return name;
    })
    this.setState({ productSpecs })



    const matAmountAll = productSpecsInfo.map(spec => {
      const amountMg = spec.materialAmount;
      const amountMgValue = parseFloat(amountMg);
      const amountKgValue = amountMgValue / 1000000;
      return amountKgValue;
    })

    // const matAmount = productSpecsInfo.map (spec => {
    //   const amountMg = spec.materialAmount;
    //   const amountMgValue = parseFloat(amountMg);
    //   if (spec.materialType === 'active' || spec.materialType === 'support') {
    //     const amountKgValue = amountMgValue/1000000;
    //     return amountKgValue;
    //   } else {
    //     return 0;
    //   }
    // })



    let actMatCosts = materialCosts.map((cost, index) => {
      let myCost = cost * matAmountAll[index]
      let myCostStr = myCost.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      return (
        <table>
          <tr key={index}>
            <td >{myCostStr} </td>
          </tr>
        </table>
      );
    })
    this.setState({ actMatCosts })



    console.log(this.state.totalActCostValue, this.state.totalActCost)

    if (this.state.totalActCostValue === 0 || isNaN(this.state.totalActCostValue)) {
      this.setState({
        msg: "No Financial Data Found for the Given Product ID!".toUpperCase(),
      });
      this.setState({ tableVisibility: false });
    } else {
      this.setState({ tableVisibility: true });
    }

    setTimeout(() => {
      this.setState({ msg: " " });
    }, 3000);
    this.setState({ actualCostData });
  };

  onChange = async (e) => {
    this.setState({
      id: this.productIdRef.current.value,
    });

    const products = await this.props.pcContract.methods.getProductsByManu(this.props.account[0]).call();
    const product = products.filter(item => {
      return item.productName === this.state.id;
    })

    const isOwner = product.map(item => {
      if (item.manufacturer === this.props.account[0]) {
        return true;
      } else {
        return false;
      }
    })
    const strBoolIsOwner = isOwner.toString();
    this.setState({ strBoolIsOwner, tableVisibility: false })


  };
  render() {
    // if (true) {
    //   return (
    //     <div>

    //       <h1 style={{ fontSize: '3em', color: '#f2f2f2' }}><span role="img" aria-label="construction">🚧</span> <br />UNDER MAINTENANCE </h1>
    //       <p><em>This feature is currently under maintenance and will be back online soon.</em></p>
    //     </div>
    //   );
    // }
    let classified, table;
    if (this.state.isTrust || this.state.strBoolIsOwner === 'true') {
      classified = "show"
    } else {
      classified = "hide"
    };
    let acc = this.props.account;
    let cont1 = this.props.pcContract;
    let cont2 = this.props.pctContract;
    let web3 = this.props.Web3;

    if (!acc || !cont1 || !cont2 || !web3) {
      return <div> Loading..... </div>;
    }
    this.state.tableVisibility ? (table = "show") : (table = "hide");

    return (
      <div className="financial-status-container">
        <form onSubmit={this.onSubmit} className="form-container">
          <div className="form-row">
            <h4>Review Cost Sheet</h4>
            <label style={{ marginRight: "5px" }}> Product ID: </label>
            <input
              type="text"
              placeholder="e.g. pro101"
              value={this.state.id}
              onChange={this.onChange}
              ref={this.productIdRef}
              required="required"
            />
            <div>
              <input
                style={{ cursor: "pointer" }}
                type="submit"
                className="btn"
                value="VIEW ACTUAL COST SHEET"
              />
            </div>
          </div>
          <div className="query-result">
            <p> {this.state.msg} </p>
          </div>
          <div className={`${table} costsClashContainer `}>
            <div className="std-cost-container">
              <table className="cost-data">
                <thead>
                  <tr>
                    <th>CRITERIA</th>
                    <th>COST</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #999' }} ><th colSpan="2">Raw Material Details</th></tr>

                  <tr>
                    <td>{this.state.names}</td>
                    <td>{this.state.actMatCosts}</td>
                  </tr>
                  <tr style={{ borderTop: '1px solid #999' }}>
                    <td> Raw Materials Total </td>
                    <td>{this.state.matActCost}</td>
                  </tr>
                  <tr>
                    <td> Packaging Materials </td>
                    <td>{this.state.pkgActCost}</td>
                  </tr>
                  <tr>
                    <td> Direct Labor </td>
                    <td>{this.state.laborActCost}</td>
                  </tr>
                  <tr
                    style={{
                      borderTop: "1px solid",
                      borderBottom: "1px solid",
                    }}
                  >
                    <th>TOTAL DIRECT COST</th>
                    <td style={{ padding: '8px 50px' }}>{this.state.totalDirectCost}</td>
                  </tr>
                  <tr className={`${classified}`}>
                    <td> Indirect Manufacturing Costs (20%) </td>
                    <td>{this.state.totalIndirectCost}</td>
                  </tr>
                  <tr className={`${classified}`}>
                    <td> Managerial and Funding Costs (30%) </td>
                    <td>{this.state.fundManuCost}</td>
                  </tr>
                  {/* <tr className={`${classified}`}>
                    <td> Value Added Tax (14%) </td>
                    <td>{(totDirValue * 14 / 100).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}</td>
                  </tr> */}
                  <tr className={`${classified}`}>
                    <td> Marketing (15%) </td>
                    <td>{this.state.mrkActCost}</td>
                  </tr>
                  <tr className={`${classified}`}>
                    <td> Research (3%)</td>
                    <td>{this.state.rsrchActCost}</td>
                  </tr>
                </tbody>

                <tfoot className={`${classified}`}>
                  <tr>
                    <th> TOTAL </th>
                    <td>{this.state.totalActCost} </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

class SetActualCosts extends Component {
  state = {
    product: "",
    productUnitsNo: '',
    packagingMaterialActCost: 0,
    mrkActCost: 0,
    rsrhActCost: 0,
    totalActCost: 0,
    matUnitActCost: 0,
    matQtyAct: 0,
    shippingActCost: 0,
    directLaborActCost: '',
    requested: [],
  };

  constructor(props) {
    super(props);
    this.proRef = React.createRef();
    this.unitNoRef = React.createRef();
    this.pkgMatActRef = React.createRef();
    this.mrkActRef = React.createRef();
    this.rsrhActRef = React.createRef();
    this.matUnitActRef = React.createRef();
    this.matQtyActRef = React.createRef();
    this.shippingActRef = React.createRef();
    this.directLaborActRef = React.createRef();
    this.OnChange = this.onChange.bind(this);
    this.OnSubmit = this.OnSubmit.bind(this);
  }


  OnSubmit = async (e) => {
    e.preventDefault();

    const requests = await this.props.pcContract.methods.getMyRequests().call();
    const matRequested = requests.map(request => {
      let id = request.materialID;
      let matRequests = [...this.state.requested, id]
      this.setState({ requested: matRequests })
      return matRequests[matRequests.length - 1];
    })


    const info = await this.props.pcContract.methods.getMaterials().call();

    const infoFiltered = info.filter(mat => {
      // based on: const found = arr1.some(r=> arr2.includes(r))
      // checks if an array contains values from another array
      return mat.some(r => matRequested.includes(r));
      //return mat.includes('mat01')

    })

    console.log(infoFiltered,infoFiltered.length);
    console.log(matRequested,matRequested.length);

    if (infoFiltered.length !== matRequested.length) {
      this.setState({
        msg: " ERROR CODE 1101: An Unexpected error occured. Make sure you requested all required materials and try again",
        error: true
      })
      setTimeout(() => {
        this.setState({ msg: " " });
      }, 4000);
    } else {
      const matInfo = infoFiltered.map(mato => {
        let matName = mato.materialName;
        this.setState({ matName })
        return matName;
      })

      const products = await this.props.pcContract.methods.getProductsByManu(this.props.account[0]).call();
      const productInfo = products.map(spec => {
        let id = spec.productName;
        this.setState({ id })
        return id;
      })

      const productSpecsInfo = await this.props.pcContract.methods.getProductSpecs(this.state.product).call();
      const productSpecs = productSpecsInfo.map(spec => {
        let name = spec.materialName;
        this.setState({ name })
        return name;
      })

      this.setState({ matRequested, matInfo, productInfo, productSpecs })


      if (matInfo.every((val, index) => val === productSpecs[index])) {

        const materialCosts = infoFiltered.map(mat => {
          const matCost = mat.unitCost;
          const matCostValue = parseFloat(matCost);
          // if (mat.materialType === 'active' || mat.materialType === 'support') {

          // } else {
          //   return 0;
          // }
          return matCostValue;

        })



        // const pkgCosts = infoFiltered.map(mat => {
        //   const matCost = mat.unitCost;
        //   const matCostValue = parseFloat(matCost);
        //   if (mat.materialType === 'packaging') {
        //     return matCostValue;
        //     } else {
        //       return 0;
        //     }
        // })

        this.setState({ materialCosts })


        // const matAmountAll = productSpecsInfo.map (spec => {
        //   const amountMg = spec.materialAmount;
        //   const amountMgValue = parseFloat(amountMg);
        //   const amountKgValue = amountMgValue/1000000;
        //   return amountKgValue;
        // })

        const matAmount = productSpecsInfo.map(spec => {
          const amountMg = spec.materialAmount;
          const amountMgValue = parseFloat(amountMg);
          if (spec.materialType === 'active' || spec.materialType === 'support') {
            const amountKgValue = amountMgValue / 1000000;
            return amountKgValue;
          } else {
            return 0;
          }
        })

        const pkgAmount = productSpecsInfo.map(spec => {
          const amountMg = spec.materialAmount;
          const amountMgValue = parseFloat(amountMg);
          if (spec.materialType === 'packaging') {

            const amountKgValue = amountMgValue / 1000000;
            return amountKgValue;
          } else {
            return 0;
          }

        })


        this.setState({ matAmount, pkgAmount });

        // multiply two arrays


        let actMatCosts = materialCosts.map((cost, index) => {
          return cost * matAmount[index]
        })
        let actPkgCosts = materialCosts.map((cost, index) => {
          return cost * pkgAmount[index]
        })
        // let actMatPkgCosts = materialCosts.map((cost, index) => {
        //   return cost * matAmountAll[index]
        // }) 


        this.setState({ actMatCosts, actPkgCosts });
        const actMaterialCostTotal = actMatCosts.reduce((a, b) => a + b, 0);
        const actPkgCostTotal = actPkgCosts.reduce((a, b) => a + b, 0);
        const actMatPkgTotal = actMaterialCostTotal + actPkgCostTotal
        //const newMaterialCost2 = materialCosts.reduce(function(r,a,i){return r+a*matAmount[i]},0)
        this.setState({ actMaterialCostTotal, actPkgCostTotal, actMatPkgTotal })

        const pro = this.state.product;
        const units = this.state.productUnitsNo;
        const actLabor = parseFloat(this.state.directLaborActCost, 10);
        const actLaborStr = actLabor.toString();
        // const matQtyAct = this.state.matQtyAct.toString();
        const matActTotal = this.state.actMatPkgTotal;
        //  const matPkgTotal = this.state.actMatPkgTotal;
        const matActTotalStr = matActTotal.toString();
        const pkgActCostValue = this.state.actPkgCostTotal;
        const pkgActCostStr = pkgActCostValue.toString();
        const totalDirectActCostValue = matActTotal + pkgActCostValue + actLabor;
        const totalDirectActCostStr = totalDirectActCostValue.toString();
        let mrkActCostValue = totalDirectActCostValue * 15 / 100;
        let rsrchActCostValue = totalDirectActCostValue * 3 / 100;
        let totalIndirectActCostValue = totalDirectActCostValue * 20 / 100;
        let fundManuCostActValue = totalDirectActCostValue * 30 / 100;
        let totalActCostValue = totalDirectActCostValue + totalIndirectActCostValue + mrkActCostValue + rsrchActCostValue + fundManuCostActValue;
        let totalActCostStr = totalActCostValue.toString();
        await this.props.pcContract.methods.setActualCost(
          pro,
          units,
          '00000',
          [
            matActTotalStr,
            pkgActCostStr,
            actLaborStr,
            totalDirectActCostStr,
            totalActCostStr,
          ]
        ).send({ from: this.props.account[0] }).once("receipt", (receipt) => {
          this.setState({ msg: "Actual Costs Were Set Successfully", error: false });
          setTimeout(() => {
            this.setState({ msg: " " });
          }, 2000);
        });

        this.setState({
          productUnitsNo: '',
          // matQtyAct: '',
          directLaborActCost: ''
        })




      } else {
        this.setState({
          msg: "ERROR CODE 2101: An Unexpected error occured. Make sure you entered a valid product Id and try again.",
          error: true
        })
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 4000);
      }


    }





    // this.setState({matRequested,productSpecs});




    // const pkgMatAct = parseInt(this.state.packagingMaterialActCost, 10);
    // // const totBudget = parseInt(this.state.budget,10);
    // const mrkAct = parseInt(this.state.mrkActCost, 10);
    // const rsrhAct = parseInt(this.state.rsrhActCost, 10);
    // const rateAct = parseInt(this.state.hourlyRateActCost, 10);
    // const hrsNoAct = parseInt(this.state.workHrsAct, 10);
    // const matUnitAct = parseInt(this.state.matUnitActCost, 10);

    // const shippingAct = parseInt(this.state.shippingActCost, 10);

    // const totalActual = matAct + pkgMatAct + labAct + manuIndirectActCost
    //                     + mrkAct + rsrhAct;

    // this.setState({ totalActCost: totalActual , totBudget});

    // await this.props.pcContract.methods
    //   .setActualCost(
    //     pro,
    //     units,
    //     pkgMatAct,
    //     matUnitAct,
    //     rateAct,
    //     hrsNoAct,
    //     mrkAct,
    //     rsrhAct,
    //     matQtyAct,
    //     shippingAct,
    //   )
    //   .send({ from: this.props.account[0] })
    //   .once("receipt", (receipt) => {
    //     this.setState({ msg: "Actual Costs Were Set Successfully" });
    //     setTimeout(() => {
    //       this.setState({ msg: " " });
    //     }, 2000);
    //   });

    // this.setState({
    //   product: "",
    //   productUnitsNo: "",
    //   directMaterialActCost: "",
    //   packagingMaterialActCost: "",
    //   laborActCost: "",
    //   mrkActCost: "",
    //   rsrhActCost: "",
    //   matUnitActCost: "",
    //   workHrsAct: "",
    //   hourlyRateActCost: "",
    //   matQtyAct: "",
    //   shippingActCost: ""
    // });
  };

  onChange = async (e) => {

    this.setState({
      product: this.proRef.current.value,
      productUnitsNo: this.unitNoRef.current.value,
      // packagingMaterialActCost: this.pkgMatActRef.current.value,
      // mrkActCost: this.mrkActRef.current.value,
      // rsrhActCost: this.rsrhActRef.current.value,
      // matUnitActCost: this.matUnitActRef.current.value,
      // workHrsAct: this.workHrsActRef.current.value,
      // hourlyRateActCost: this.hourlyRateActRef.current.value,
      // matQtyAct: this.matQtyActRef.current.value,
      // shippingActCost: this.shippingActRef.current.value,
      directLaborActCost: this.directLaborActRef.current.value,
    });
  };
  render() {
    // if(true) {
    //  return( 
    //   <div>

    //     <h1 style={{fontSize: '3em', color: '#f2f2f2'}}><span role="img" aria-label="construction">🚧</span> <br/>UNDER MAINTENANCE </h1>
    //     <p><em>This feature is currently under maintenance and will be back online soon.</em></p>
    //   </div>
    //  );
    // }
    let msgType;
    this.state.error ? msgType = 'alert' : msgType = 'good'
    return (
      <form onSubmit={this.OnSubmit} className="newform-container">
        <label>Product ID:</label>
        <input
          type="text"
          ref={this.proRef}
          value={this.state.product}
          placeholder="e.g. pro101"
          onChange={this.OnChange}
          required="required"
        />

        <h4> Set Production Units </h4>
        <label>Actual Production Units No: </label>
        <input
          type="number"
          ref={this.unitNoRef}
          value={this.state.productUnitsNo}
          placeholder="e.g. 50,000"
          onChange={this.OnChange}
          required="required"
        />

        {/* <h4>Set Material Quantity</h4>
        <label>Actual Material Quantity (g):</label>
        <input
          type="number"
          ref={this.matQtyActRef}
          value={this.matQtyAct}
          placeholder="e.g. 1600"
          onChange={this.onChange}
          required="required"
        /> */}

        <h4> Set Actual Costs </h4>
        {/* 
        <label>Unit Material Cost: </label>
        <input
          type="number"
          ref={this.matUnitActRef}
          value={this.state.matUnitActCost}
          placeholder="e.g. 5"
          onChange={this.OnChange}
          required="required"
        /> */}

        {/* <label>Packaging Materials: </label>
        <input
          type="number"
          ref={this.pkgMatActRef}
          value={this.state.packagingMaterialActCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required="required"
        /> */}

        <label>Direct Labor Cost: </label>
        <input
          type="number"
          ref={this.directLaborActRef}
          value={this.state.directLaborActCost}
          placeholder="e.g. 2000"
          onChange={this.OnChange}
          required="required"
        />

        {/* <label>Hourly Work Rate: </label>
        <input
          type="number"
          ref={this.hourlyRateActRef}
          value={this.state.hourlyRateActCost}
          placeholder="e.g. 50"
          onChange={this.OnChange}
          required="required"
        />

        <label>Shipping Cost: </label>
        <input
          type="number"
          ref={this.shippingActRef}
          value={this.state.shippingActCost}
          placeholder="e.g. 50"
          onChange={this.OnChange}
          required="required"
        />

        <label>Marketing: </label>
        <input
          type="number"
          ref={this.mrkActRef}
          value={this.state.mrkActCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required="required"
        />

        <label>Research: </label>
        <input
          type="number"
          ref={this.rsrhActRef}
          value={this.state.rsrhActCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required="required"
        /> */}

        <input type="submit" className="btn" value="SET ACTUAL COSTS" />

        <div style={{ marginTop: "20px" }} className={`notify-text ${msgType}-text`}>
          {this.state.msg}
        </div>
      </form>
    );
  }
}

class SetFlexibleBudget extends Component {
  state = {
    product: "",
    productUnitsNo: '',
    totalMaterialFlexCost: '',
    packagingMaterialFlexCost: '',
    totalLaborFlexCost: '',
    totalDirectFlexCost: 0,
    totalFlexCost: 0,
  };

  constructor(props) {
    super(props);
    this.proRef = React.createRef();
    this.unitNoRef = React.createRef();
    this.pkgMatFlexRef = React.createRef();
    this.totalMatFlexRef = React.createRef();
    this.totalLaborFlexRef = React.createRef();
    this.OnChange = this.onChange.bind(this);
    this.OnSubmit = this.OnSubmit.bind(this);
  }

  OnSubmit = async (e) => {
    e.preventDefault();

    const pro = this.state.product;
    const units = this.state.productUnitsNo;
    const totalMatFlex = parseFloat(this.state.totalMaterialFlexCost, 10);
    const totalMatFlexStr = totalMatFlex.toString();
    const pkgMatFlex = parseFloat(this.state.packagingMaterialFlexCost, 10);
    const pkgMatFlexStr = pkgMatFlex.toString();
    const totalLaborFlex = parseFloat(this.state.totalLaborFlexCost, 10);
    const totalLaborFlexStr = totalLaborFlex.toString();
    const totalDirectFlexCost = totalMatFlex + pkgMatFlex + totalLaborFlex;
    const totalDirectFlexCostStr = totalDirectFlexCost.toString();
    const totalIndirectFlexCost = totalDirectFlexCost * 20 / 100;
    const FundManuFlexCost = totalDirectFlexCost * 30 / 100;
    const mrkFlex = totalDirectFlexCost * 15 / 100;
    const rsrhFlex = totalDirectFlexCost * 3 / 100;
    const totalFlexCost = totalDirectFlexCost + totalIndirectFlexCost + FundManuFlexCost + mrkFlex + rsrhFlex;
    const totalFlexCostStr = totalFlexCost.toString();
    // const shippingFlex = parseInt(this.state.shippingFlexCost, 10);


    // const totalFlex = matFlex + pkgMatFlex + labFlex + manuIndirectFlexCost
    //                     + mrkFlex + rsrhFlex;

    // this.setState({ totalFlexCost: totalFlex});

    await this.props.pcContract.methods
      .setFlexibleCosts(
        pro,
        units,
        [
          totalMatFlexStr,
          pkgMatFlexStr,
          totalLaborFlexStr,
          totalDirectFlexCostStr,
          totalFlexCostStr

        ]
      )
      .send({ from: this.props.account[0] })
      .once("receipt", (receipt) => {
        this.setState({ msg: "Flexible Costs Were Set Successfully" });
        setTimeout(() => {
          this.setState({ msg: " " });
        }, 2000);
      });

    this.setState({
      productUnitsNo: "",
      totalMaterialFlexCost: '',
      packagingMaterialFlexCost: '',
      totalLaborFlexCost: '',
    });
  };

  onChange = async (e) => {
    this.setState({
      product: this.proRef.current.value,
      productUnitsNo: this.unitNoRef.current.value,
      packagingMaterialFlexCost: this.pkgMatFlexRef.current.value,
      totalMaterialFlexCost: this.totalMatFlexRef.current.value,
      totalLaborFlexCost: this.totalLaborFlexRef.current.value
    });
  };
  render() {
    // if (true) {
    //   return (
    //     <div>

    //       <h1 style={{ fontSize: '3em', color: '#f2f2f2' }}><span role="img" aria-label="construction">🚧</span> <br />UNDER MAINTENANCE </h1>
    //       <p><em>This feature is currently under maintenance and will be back online soon.</em></p>
    //     </div>
    //   );
    // }
    return (
      <form onSubmit={this.OnSubmit} className="newform-container">
        <label>Product ID:</label>
        <input
          type="text"
          ref={this.proRef}
          value={this.state.product}
          placeholder="e.g. pro101"
          onChange={this.OnChange}
          required="required"
        />

        <h4> Set Production Units </h4>
        <label>Flexible Production Units No: </label>
        <input
          type="number"
          ref={this.unitNoRef}
          value={this.state.productUnitsNo}
          placeholder="e.g. 50,000"
          onChange={this.OnChange}
          required="required"
        />

        <h4> Set Flexible Costs </h4>

        <label>Material Cost Total: </label>
        <input
          type="number"
          ref={this.totalMatFlexRef}
          value={this.state.totalMaterialFlexCost}
          placeholder="e.g. 5"
          onChange={this.OnChange}
          required="required"
        />

        <label>Packaging Materials Total: </label>
        <input
          type="number"
          ref={this.pkgMatFlexRef}
          value={this.state.packagingMaterialFlexCost}
          placeholder="e.g. 5000"
          onChange={this.OnChange}
          required="required"
        />

        <label>Labor Cost Total: </label>
        <input
          type="number"
          ref={this.totalLaborFlexRef}
          value={this.state.totalLaborFlexCost}
          placeholder="e.g. 2000"
          onChange={this.OnChange}
          required="required"
        />




        <input type="submit" className="btn" value="SET FLEXIBLE COSTS" />

        <div style={{ marginTop: "20px" }} className="notify-text">
          {this.state.msg}
        </div>
      </form>
    );
  }
}

class CalculateStaticVariance extends Component {
  state = { id: "", tableVisibility: false };

  constructor(props) {
    super(props);
    this.productIdRef = React.createRef();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const proId = this.state.id;
    const standard = await this.props.pcContract.methods
      .getStdCostPlan(proId)
      .call();
    const stdCostData = standard.map((item, index) => {
      let matCostValue = parseFloat(standard.directMaterialCost, 10);
      let pkgCostValue = parseFloat(standard.packagingMaterialCost, 10);
      let laborCostValue = parseFloat(standard.directLaborCost, 10);
      let totalDirectCostValue = parseFloat(standard.totalDirectCost, 10)
      let mrkCostValue = totalDirectCostValue * 15 / 100;
      let rsrchCostValue = totalDirectCostValue * 3 / 100;
      let totalIndirectCostValue = totalDirectCostValue * 20 / 100;
      let totalStdCostValue = parseFloat(standard.CostTOT, 10);
      // let totalActCostValue =
      //   matActCostValue +
      //   pkgActCostValue +
      //   laborActCostValue +
      //   mrkActCostValue +
      //   rsrchActCostValue;

      let matCost = matCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let pkgCost = pkgCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let laborCost = laborCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      let mrkCost = mrkCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let rsrchCost = rsrchCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let totalStdCost = totalStdCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      let totalDirectCost = totalDirectCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      let totalIndirectCost = totalIndirectCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });


      this.setState({
        standard,
        matCost,
        pkgCost,
        laborCost,
        mrkCost,
        rsrchCost,
        totalStdCost,
        totalDirectCost,
        totalIndirectCost,
        matCostValue,
        pkgCostValue,
        laborCostValue,
        mrkCostValue,
        rsrchCostValue,
        totalStdCostValue,
        totalDirectCostValue,
        totalIndirectCostValue
      });
      return true;
    });

    const actual = await this.props.pcContract.methods
      .getActualCost(proId)
      .call();

    const actualCostData = actual.map((item, index) => {
      let matActCostValue = parseFloat(actual.directMaterialCost, 10);
      let pkgActCostValue = parseFloat(actual.packagingMaterialCost, 10);
      let laborActCostValue = parseFloat(actual.directLaborCost, 10);
      let totalDirectActCostValue = parseFloat(actual.totalDirectCost, 10)
      let mrkActCostValue = totalDirectActCostValue * 15 / 100;
      let rsrchActCostValue = totalDirectActCostValue * 3 / 100;
      let totalIndirectActCostValue = totalDirectActCostValue * 20 / 100;
      let totalActCostValue = parseFloat(actual.CostTOT, 10);
      // let totalActCostValue =
      //   matActCostValue +
      //   pkgActCostValue +
      //   laborActCostValue +
      //   mrkActCostValue +
      //   rsrchActCostValue;

      let matActCost = matActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let pkgActCost = pkgActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let laborActCost = laborActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      let mrkActCost = mrkActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let rsrchActCost = rsrchActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let totalActCost = totalActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      let totalDirectActCost = totalDirectActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      let totalIndirectActCost = totalIndirectActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });


      this.setState({
        actual,
        matActCost,
        pkgActCost,
        laborActCost,
        mrkActCost,
        rsrchActCost,
        totalActCost,
        totalDirectActCost,
        totalIndirectActCost,
        matActCostValue,
        pkgActCostValue,
        laborActCostValue,
        mrkActCostValue,
        rsrchActCostValue,
        totalActCostValue,
        totalDirectActCostValue,
        totalIndirectActCostValue
      });
      return true;
    });

    if (
      this.state.totalCost === "$0.00" ||
      this.state.totalActCost === "$0.00" ||
      isNaN(this.state.totalStdCostValue) ||
      isNaN(this.state.totalActCostValue)
    ) {
      this.setState({
        msg: "No Financial Data Found for the Given Product ID!".toUpperCase(),
      });
      this.setState({ tableVisibility: false });
    } else {
      this.setState({ msg: '', tableVisibility: true });
    }

    setTimeout(() => {
      this.setState({ msg: " " });
    }, 3000);
    this.setState({ stdCostData, actualCostData });
  };

  onChange = async (e) => {
    this.setState({
      id: this.productIdRef.current.value,
    });
  };
  render() {
    // if (true) {
    //   return (
    //     <div>

    //       <h1 style={{ fontSize: '3em', color: '#f2f2f2' }}><span role="img" aria-label="construction">🚧</span> <br />UNDER MAINTENANCE </h1>
    //       <p><em>This feature is currently under maintenance and will be back online soon.</em></p>
    //     </div>
    //   );
    // }
    let table;
    let acc = this.props.account;
    let cont1 = this.props.pcContract;
    let cont2 = this.props.pctContract;
    let web3 = this.props.Web3;

    if (!acc || !cont1 || !cont2 || !web3) {
      return <div> Loading..... </div>;
    }
    this.state.tableVisibility ? (table = "show") : (table = "hide");
    return (
      <div className="financial-status-container">
        <form onSubmit={this.onSubmit} className="form-container">
          <div className="form-row">
            <h4>Review Static-Budget Variance</h4>
            <label style={{ marginRight: "5px" }}> Product ID: </label>
            <input
              type="text"
              placeholder="e.g. pro101"
              value={this.state.id}
              onChange={this.onChange}
              ref={this.productIdRef}
              required="required"
            />
            <div>
              <input
                style={{ cursor: "pointer" }}
                type="submit"
                className="btn"
                value="VIEW VARIANCE"
              />
            </div>
          </div>
          <div className="query-result">
            <p> {this.state.msg} </p>
          </div>
          <div className={`${table} costsClashContainer `}>
            <div className="std-cost-container">
              <table className="cost-data">
                <thead>
                  <tr>
                    <th>CRITERIA</th>
                    <th>STANDARD COSTS</th>
                    <th>STATIC-BUDGET VARIANCE</th>
                    <th>ACTUAL COSTS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td> Raw Materials </td>
                    <td>{this.state.matCost}</td>
                    <td>
                      {Math.abs(
                        this.state.matCostValue - this.state.matActCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.matActCost}</td>
                  </tr>
                  <tr>
                    <td> Packaging Materials </td>
                    <td>{this.state.pkgCost}</td>
                    <td>
                      {Math.abs(
                        this.state.pkgCostValue - this.state.pkgActCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.pkgActCost}</td>
                  </tr>
                  <tr>
                    <td> Direct Labor </td>
                    <td>{this.state.laborCost}</td>
                    <td>
                      {Math.abs(
                        this.state.laborCostValue - this.state.laborActCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.laborActCost}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #999', borderTop: '1px solid #999' }}>
                    <td> Total Direct Costs </td>
                    <td>{this.state.totalDirectCost}</td>
                    <td>
                      {Math.abs(
                        this.state.totalDirectCostValue -
                        this.state.totalDirectActCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.totalDirectActCost}</td>
                  </tr>
                  <tr>
                    <td> Total Indirect Costs </td>
                    <td>{this.state.totalIndirectCost}</td>
                    <td>
                      {Math.abs(
                        this.state.totalIndirectCostValue -
                        this.state.totalDirectActCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.totalDirectActCost}</td>
                  </tr>
                  <tr>
                    <td> Marketing </td>
                    <td>{this.state.mrkCost}</td>
                    <td>
                      {Math.abs(
                        this.state.mrkCostValue - this.state.mrkActCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.mrkActCost}</td>
                  </tr>
                  <tr>
                    <td> Research </td>
                    <td>{this.state.rsrchCost}</td>
                    <td>
                      {Math.abs(
                        this.state.rsrchCostValue - this.state.rsrchActCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.rsrchActCost}</td>
                  </tr>
                </tbody>

                <tfoot>
                  <tr>
                    <th> TOTAL </th>
                    <td>{this.state.totalStdCost} </td>
                    <td>
                      {Math.abs(
                        this.state.totalStdCostValue -
                        this.state.totalActCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.totalActCost} </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

class CalculateFlexibleVariance extends Component {

  state = { id: "", tableVisibility: false };

  constructor(props) {
    super(props);
    this.productIdRef = React.createRef();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const proId = this.state.id;
    const standard = await this.props.pcContract.methods
      .getStdCostPlan(proId)
      .call();
    const stdCostData = standard.map((item, index) => {
      let matCostValue = parseFloat(standard.directMaterialCost, 10);
      let pkgCostValue = parseFloat(standard.packagingMaterialCost, 10);
      let laborCostValue = parseFloat(standard.directLaborCost, 10);
      let totalDirectCostValue = parseFloat(standard.totalDirectCost, 10);
      let mrkCostValue = totalDirectCostValue * 15 / 100;
      let rsrchCostValue = totalDirectCostValue * 3 / 100;
      let totalIndirectCostValue = totalDirectCostValue * 20 / 100;
      let totalStdCostValue = parseFloat(standard.CostTOT, 10);

      // let totalStdCostValue =
      //   matCostValue +
      //   pkgCostValue +
      //   laborCostValue +

      //   mrkCostValue +
      //   rsrchCostValue;

      let matCost = matCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let pkgCost = pkgCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let laborCost = laborCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      let mrkCost = mrkCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let rsrchCost = rsrchCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      // let totalCost = totalCostValue.toLocaleString("en-US", {style: "currency", currency: "USD"});
      let totalDirectCost = totalDirectCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let totalIndirectCost = totalIndirectCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let totalStdCost = totalStdCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      this.setState({
        standard,
        proId,
        matCost,
        pkgCost,
        laborCost,
        mrkCost,
        rsrchCost,
        totalDirectCost,
        totalIndirectCost,
        totalStdCost,
        matCostValue,
        pkgCostValue,
        laborCostValue,
        mrkCostValue,
        rsrchCostValue,
        totalDirectCostValue,
        totalIndirectCostValue,
        totalStdCostValue,
      });
      return true;
    });

    const actual = await this.props.pcContract.methods
      .getActualCost(proId)
      .call();

    const actualCostData = actual.map((item, index) => {
      let matActCostValue = parseFloat(actual.directMaterialCost, 10);
      let pkgActCostValue = parseFloat(actual.packagingMaterialCost, 10);
      let laborActCostValue = parseFloat(actual.directLaborCost, 10);
      let totalDirectActCostValue = parseFloat(actual.totalDirectCost, 10);
      let mrkActCostValue = totalDirectActCostValue * 15 / 100;
      let rsrchActCostValue = totalDirectActCostValue * 3 / 100;
      let totalIndirectActCostValue = totalDirectActCostValue * 20 / 100;
      let totalActCostValue = parseFloat(actual.CostTOT, 10);

      // let totalStdCostValue =
      //   matCostValue +
      //   pkgCostValue +
      //   laborCostValue +

      //   mrkCostValue +
      //   rsrchCostValue;

      let matActCost = matActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let pkgActCost = pkgActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let laborActCost = laborActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      let mrkActCost = mrkActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let rsrchActCost = rsrchActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      // let totalCost = totalCostValue.toLocaleString("en-US", {style: "currency", currency: "USD"});
      let totalDirectActCost = totalDirectActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let totalIndirectActCost = totalIndirectActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let totalActCost = totalActCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      this.setState({
        actual,
        proId,
        matActCost,
        pkgActCost,
        laborActCost,
        mrkActCost,
        rsrchActCost,
        totalDirectActCost,
        totalIndirectActCost,
        totalActCost,
        matActCostValue,
        pkgActCostValue,
        laborActCostValue,
        mrkActCostValue,
        rsrchActCostValue,
        totalDirectActCostValue,
        totalIndirectActCostValue,
        totalActCostValue,
      });
      return true;
    });

    const flexible = await this.props.pcContract.methods
      .getFlexibleCosts(proId)
      .call();
    const flexCostData = flexible.map((item, index) => {
      let matFlexCostValue = parseFloat(flexible.directMaterialCost, 10);
      let pkgFlexCostValue = parseFloat(flexible.packagingMaterialCost, 10);
      let laborFlexCostValue = parseFloat(flexible.directLaborCost, 10);
      let totalDirectFlexCostValue = parseFloat(flexible.totalDirectCost, 10);
      let mrkFlexCostValue = totalDirectFlexCostValue * 15 / 100;
      let rsrchFlexCostValue = totalDirectFlexCostValue * 3 / 100;
      let totalIndirectFlexCostValue = totalDirectFlexCostValue * 20 / 100;
      let totalFlexCostValue = parseFloat(flexible.CostTOT, 10);

      // let totalFlexCostValue =
      //   matCostValue +
      //   pkgCostValue +
      //   laborCostValue +

      //   mrkCostValue +
      //   rsrchCostValue;

      let matFlexCost = matFlexCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let pkgFlexCost = pkgFlexCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let laborFlexCost = laborFlexCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      let mrkFlexCost = mrkFlexCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let rsrchFlexCost = rsrchFlexCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      // let totalCost = totalCostValue.toLocaleString("en-US", {style: "currency", currency: "USD"});
      let totalDirectFlexCost = totalDirectFlexCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let totalIndirectFlexCost = totalIndirectFlexCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      let totalFlexCost = totalFlexCostValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

      this.setState({
        flexible,
        proId,
        matFlexCost,
        pkgFlexCost,
        laborFlexCost,
        mrkFlexCost,
        rsrchFlexCost,
        totalDirectFlexCost,
        totalIndirectFlexCost,
        totalFlexCost,
        matFlexCostValue,
        pkgFlexCostValue,
        laborFlexCostValue,
        mrkFlexCostValue,
        rsrchFlexCostValue,
        totalDirectFlexCostValue,
        totalIndirectFlexCostValue,
        totalFlexCostValue,
      });
      return true;
    });

    if (
      this.state.totalStdCost === "$0.00" ||
      this.state.totalActCost === "$0.00" ||
      this.state.totalFlexCost === "$0.00" ||
      isNaN(this.state.totalStdCostValue) ||
      isNaN(this.state.totalActCostValue) ||
      isNaN(this.state.totalFlexCostValue)
    ) {
      this.setState({
        msg: "No Financial Data Found for the Given Product ID!".toUpperCase(),
      });
      this.setState({ tableVisibility: false });
    } else {

      this.setState({ msg: '', tableVisibility: true });
    }

    setTimeout(() => {
      this.setState({ msg: " " });
    }, 3000);
    this.setState({ stdCostData, actualCostData, flexCostData });
  };

  onChange = async (e) => {
    this.setState({
      id: this.productIdRef.current.value,
    });
  };

  render() {
    // if (true) {
    //   return (
    //     <div>

    //       <h1 style={{ fontSize: '3em', color: '#f2f2f2' }}><span role="img" aria-label="construction">🚧</span> <br />UNDER MAINTENANCE </h1>
    //       <p><em>This feature is currently under maintenance and will be back online soon.</em></p>
    //     </div>
    //   );
    // }
    let table;
    let acc = this.props.account;
    let cont1 = this.props.pcContract;
    let cont2 = this.props.pctContract;
    let web3 = this.props.Web3;

    if (!acc || !cont1 || !cont2 || !web3) {
      return <div> Loading..... </div>;
    }
    this.state.tableVisibility ? (table = "show") : (table = "hide");
    return (
      <div className="financial-status-container">
        <form onSubmit={this.onSubmit} className="form-container">
          <div className="form-row">
            <h4>Review Flexible-Budget Variance</h4>
            <label style={{ marginRight: "5px" }}> Product ID: </label>
            <input
              type="text"
              placeholder="e.g. pro101"
              value={this.state.id}
              onChange={this.onChange}
              ref={this.productIdRef}
              required="required"
            />
            <div>
              <input
                style={{ cursor: "pointer" }}
                type="submit"
                className="btn"
                value="VIEW VARIANCE"
              />
            </div>
          </div>
          <div className="query-result">
            <p> {this.state.msg} </p>
          </div>
          <div className={`${table} costsClashContainer `}>
            <div className="std-cost-container">
              <table className="cost-data">
                <thead>
                  <tr>
                    <th>CRITERIA</th>
                    <th>ACTUAL COSTS</th>
                    <th>FLEXIBLE-BUDGET VARIANCE</th>
                    <th>FLEXIBLE COSTS</th>
                    <th>SALES-BUDGET VARIANCE</th>
                    <th>STANDARD COSTS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td> Raw Materials </td>
                    <td>{this.state.matActCost}</td>
                    <td>
                      {Math.abs(
                        this.state.matActCostValue - this.state.matFlexCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.matFlexCost}</td>
                    <td>
                      {Math.abs(
                        this.state.matFlexCostValue - this.state.matCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.matCost}</td>
                  </tr>
                  <tr>
                    <td> Packaging Materials </td>
                    <td>{this.state.pkgActCost}</td>
                    <td>
                      {Math.abs(
                        this.state.pkgActCostValue - this.state.pkgFlexCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.pkgFlexCost}</td>
                    <td>
                      {Math.abs(
                        this.state.pkgFlexCostValue - this.state.pkgCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.pkgCost}</td>
                  </tr>
                  <tr>
                    <td> Direct Labor </td>
                    <td>{this.state.laborActCost}</td>
                    <td>
                      {Math.abs(
                        this.state.laborActCostValue -
                        this.state.laborFlexCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.laborFlexCost}</td>
                    <td>
                      {Math.abs(
                        this.state.laborFlexCostValue -
                        this.state.laborCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.laborCost}</td>
                  </tr>
                  <tr style={{ borderTop: '1px solid #999', borderBottom: '1px solid #999' }}>
                    <td>Total Direct Costs</td>
                    <td>{this.state.totalDirectActCost}</td>
                    <td>
                      {Math.abs(
                        this.state.totalDirectActCostValue -
                        this.state.totalDirectFlexCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.totalDirectFlexCost}</td>

                    <td>
                      {Math.abs(
                        this.state.totalDirectFlexCostValue -
                        this.state.totalDirectCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.totalDirectCost}</td>
                  </tr>
                  <tr>
                    <td>Indirect Manufacturing Costs</td>
                    <td>{this.state.totalIndirectActCost}</td>
                    <td>
                      {Math.abs(
                        this.state.totalIndirectActCostValue -
                        this.state.totalIndirectFlexCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.totalDirectFlexCost}</td>

                    <td>
                      {Math.abs(
                        this.state.totalIndirectFlexCostValue -
                        this.state.totalIndirectCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.totalIndirectCost}</td>
                  </tr>
                  <tr>
                    <td> Marketing </td>
                    <td>{this.state.mrkActCost}</td>
                    <td>
                      {Math.abs(
                        this.state.mrkActCostValue - this.state.mrkFlexCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.mrkFlexCost}</td>
                    <td>
                      {Math.abs(
                        this.state.mrkFlexCostValue - this.state.mrkCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.mrkCost}</td>
                  </tr>
                  <tr>
                    <td> Research </td>
                    <td>{this.state.rsrchActCost}</td>
                    <td>
                      {Math.abs(
                        this.state.rsrchActCostValue -
                        this.state.rsrchFlexCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.rsrchFlexCost}</td>
                    <td>
                      {Math.abs(
                        this.state.rsrchFlexCostValue -
                        this.state.rsrchCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.rsrchCost}</td>
                  </tr>
                </tbody>

                <tfoot>
                  <tr>
                    <th> TOTAL </th>
                    <td>{this.state.totalActCost}</td>
                    <td>
                      {Math.abs(
                        this.state.totalActCostValue -
                        this.state.totalFlexCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.totalFlexCost}</td>
                    <td>
                      {Math.abs(
                        this.state.totalFlexCostValue -
                        this.state.totalStdCostValue
                      ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </td>
                    <td>{this.state.totalStdCost}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

class CalculatePriceVariance extends Component {
  state = { id: "", tableVisibility: false , requested: []};

  constructor(props) {
    super(props);
    this.productIdRef = React.createRef();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const proId = this.state.id;
    const specs = await this.props.pcContract.methods
      .getProductSpecs(proId)
      .call();

    const actQty = await this.props.pcContract.methods
      .getActualBudgetUnits(proId)
      .call();
    this.setState({ actQty });

    const specInfo = specs.map(spec => {
      let name = spec.materialName;
      this.setState({name});
      return name;
    })

    this.setState({specInfo})

    const specCostInfo = specs.map(spec => {
      let unitCost = spec.materialUnitCost;
      let unitCostValue = parseFloat(unitCost)
      this.setState({unitCost});
      return unitCostValue;
    })
    console.log(specCostInfo)
    this.setState({specCostInfo})

    const specAmountInfo = specs.map(spec => {
      let amountMg = spec.materialAmount;
      let amountKg = amountMg/1000000;
      this.setState({amountKg});
      return amountKg;
    })
    console.log(specAmountInfo);
    this.setState({specAmountInfo})


    // cost of product specs for total production units
    const materialActualAmount = specAmountInfo.map((spec,index) => {
      let amount = spec*parseFloat(actQty);

      return amount
    })
    console.log(materialActualAmount);
    this.setState({materialActualAmount})

    const requests = await this.props.pcContract.methods.getMyRequests().call();
    const matRequested = requests.map(request => {
      let id = request.materialID;
      let matRequests = [...this.state.requested, id]
      this.setState({ requested: matRequests })
      return matRequests[matRequests.length - 1];
    })
    if (requests.length === 0) {
      this.setState({
        msg: "No Financial Data Found for the Given Product ID!".toUpperCase(),
      });
      setTimeout(() => {
        this.setState({ msg: " " });
      }, 3000);
    }

    const matInfo = await this.props.pcContract.methods.getMaterials().call();

    const matInfoFiltered = matInfo.filter(mat => {
      // based on: const found = arr1.some(r=> arr2.includes(r))
      // checks if an array contains values from another array
      return mat.some(r => matRequested.includes(r));
      //return mat.includes('mat01')

    })

    const names = matInfoFiltered.map((mat, index) => {
      let name = mat.materialName;
      return (
        <table>
          <tr key={index}>
            <td style={{ padding: '8px 0px' }}> {name} </td>
          </tr>
        </table>
      );
    })

    this.setState({ names })


    const materialCosts = matInfoFiltered.map( (mat) => {
      const matCost = mat.unitCost;
      const matCostValue = parseFloat(matCost);
      this.setState({matCostValue})
      return matCostValue;

    })
    this.setState({materialCosts});
    // substract two arrays and return positive numbers
    // based on 
    // A.map( (x, i) => x - B[i] ).map( x => Math.abs(x) );

    const costDiff = materialCosts.map( (x, i) => x - specCostInfo[i] ).map( x => Math.abs(x) );
    this.setState({costDiff})

    const priceVariance = costDiff.map( (x, i) => x * materialActualAmount[i] ).map( x => x );

    const priceVarianceStrs = priceVariance.map( (variance , index) => {
     let costStr = variance.toLocaleString(
        "en-US",
        { style: "currency", currency: "USD" }
      );

      return (
        <tr>
          <td> { costStr} </td>
        </tr>
      );
    })

    this.setState({priceVarianceStrs})

    const totalVariance = priceVariance.reduce((a, b) => a + b, 0);
    const totalVarianceStr = totalVariance.toLocaleString(
          "en-US",
          { style: "currency", currency: "USD" }
        );
    this.setState({totalVariance,totalVarianceStr})

    if (
      this.state.totalVariance === 0 ||
      isNaN(this.state.totalVariance) 
    ) {
      this.setState({
        msg: "No Financial Data Found for the Given Product ID!".toUpperCase(),
      });
      this.setState({ tableVisibility: false });
    } else {
      this.setState({msg: '', tableVisibility: true });
    }

    setTimeout(() => {
      this.setState({ msg: " " });
    }, 3000);
    // this.setState({ stdCostData, actualCostData });

  };

  onChange = async (e) => {
    this.setState({
      id: this.productIdRef.current.value,
    });

  };
  render() {
 
    let table;
    let acc = this.props.account;
    let cont1 = this.props.pcContract;
    let cont2 = this.props.pctContract;
    let web3 = this.props.Web3;

    if (!acc || !cont1 || !cont2 || !web3) {
      return <div> Loading..... </div>;
    }
    this.state.tableVisibility ? (table = "show") : (table = "hide");

    return (
      <div className="financial-status-container">
        <form onSubmit={this.onSubmit} className="form-container">
          <div className="form-row">
            <h4>Review Direct-Cost Price Variance</h4>
            <label style={{ marginRight: "5px" }}> Product ID: </label>
            <input
              type="text"
              placeholder="e.g. pro101"
              value={this.state.id}
              onChange={this.onChange}
              ref={this.productIdRef}
              required="required"
            />
            <div>
              <input
                style={{ cursor: "pointer" }}
                type="submit"
                className="btn"
                value="VIEW VARIANCE"
              />
            </div>
          </div>
          <div className="query-result">
            <p> {this.state.msg} </p>
          </div>
          <div className={`${table} costsClashContainer `}>
            <div className="std-cost-container">
              <table className="cost-data" cellSpacing="90">
                <thead>
                  <tr>
                    <th>CATEGORY</th>
                    <th>PRICE VARIANCE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{borderBottom: '1px solid #999'}}>
                    <th>No of Production Units</th>
                    <td style={{textAlign:'center'}}>{`${this.state.actQty} units`}</td>
                  </tr>
                  <tr style={{borderBottom: '1px solid #999'}}>
                    <td colSpan="2">Direct Material Details </td>
                  </tr>
                  <tr>

                    <td>
                      {/* {`(${this.state.materialUnitActCost} per gram - ${this.state.materialUnitStdCost} per gram)  * ${this.state.actQty} grams = ${this.state.material}`} */}
                       {this.state.names}
                    </td>
                    <td>{this.state.priceVarianceStrs}</td>
                  </tr>
                  <tr style={{borderTop:'1px solid #999', borderBottom: '1px solid #999'}}>
                    <td>total</td>
                    <td>{this.state.totalVarianceStr}</td>
                </tr>
                  {/* <tr>
                    <td> Direct Labor </td>
                    <td>
                      {`(${this.state.hourlyActRate} per hour - ${this.state.hourlyStdRate} per hour )  * ${this.state.workHrsActNo} hours = ${this.state.labor}`}
                    </td>
                  </tr> */}
                </tbody>
                <tfoot>
                
                </tfoot>
              </table>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

class CalculateQuantityVariance extends Component {
  state = { id: "", tableVisibility: false , requested: []};

  constructor(props) {
    super(props);
    this.productIdRef = React.createRef();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const proId = this.state.id;
    const specs = await this.props.pcContract.methods
      .getProductSpecs(proId)
      .call();

    const actQty = await this.props.pcContract.methods
      .getActualBudgetUnits(proId)
      .call();
    this.setState({ actQty });

    const specInfo = specs.map(spec => {
      let name = spec.materialName;
      this.setState({name});
      return name;
    })

    this.setState({specInfo})

    const specCostInfo = specs.map(spec => {
      let unitCost = spec.materialUnitCost;
      let unitCostValue = parseFloat(unitCost)
      this.setState({unitCost});
      return unitCostValue;
    })
    console.log(specCostInfo)
    this.setState({specCostInfo})

    const specAmountInfo = specs.map(spec => {
      let amountMg = spec.materialAmount;
      let amountKg = amountMg/1000000;
      this.setState({amountKg});
      return amountKg;
    })
    console.log(specAmountInfo);
    this.setState({specAmountInfo})


    const materialStdAmount =  specAmountInfo.map((spec,index) => {
      let amount = spec*parseFloat(actQty);

      return amount
    })

    console.log(materialStdAmount);
    this.setState({materialStdAmount})

    // cost of product specs for total production units
    const materialActualAmount = specAmountInfo.map((spec,index) => {
      let amount = spec*parseFloat(actQty);

      return amount
    })
    console.log(materialActualAmount);
    this.setState({materialActualAmount})

    const requests = await this.props.pcContract.methods.getMyRequests().call();
    const matRequested = requests.map(request => {
      let id = request.materialID;
      let matRequests = [...this.state.requested, id]
      this.setState({ requested: matRequests })
      return matRequests[matRequests.length - 1];
    })
    if (requests.length === 0) {
      this.setState({
        msg: "No Financial Data Found for the Given Product ID!".toUpperCase(),
      });
      setTimeout(() => {
        this.setState({ msg: " " });
      }, 3000);
    }

    const matInfo = await this.props.pcContract.methods.getMaterials().call();

    const matInfoFiltered = matInfo.filter(mat => {
      // based on: const found = arr1.some(r=> arr2.includes(r))
      // checks if an array contains values from another array
      return mat.some(r => matRequested.includes(r));
      //return mat.includes('mat01')

    })

    const names = matInfoFiltered.map((mat, index) => {
      let name = mat.materialName;
      return (
        <table>
          <tr key={index}>
            <td style={{ padding: '8px 0px' }}> {name} </td>
          </tr>
        </table>
      );
    })

    this.setState({ names })


    const materialCosts = matInfoFiltered.map( (mat) => {
      const matCost = mat.unitCost;
      const matCostValue = parseFloat(matCost);
      this.setState({matCostValue})
      return matCostValue;

    })
    this.setState({materialCosts});
    // substract two arrays and return positive numbers
    // based on 
    // A.map( (x, i) => x - B[i] ).map( x => Math.abs(x) );

    const qtyDiff = materialStdAmount.map( (x, i) => x - materialActualAmount[i] ).map( x => Math.abs(x) );
    this.setState({qtyDiff})

    const qtyVariance = qtyDiff.map( (x, i) => x * specCostInfo[i] ).map( x => x );

    const qtyVarianceStrs = qtyVariance.map( (variance , index) => {
     let costStr = variance.toLocaleString(
        "en-US",
        { style: "currency", currency: "USD" }
      );

      return (
        <tr>
          <td> { costStr} </td>
        </tr>
      );
    })

    this.setState({qtyVarianceStrs})

    const totalVariance = qtyVariance.reduce((a, b) => a + b, 0);
    const totalVarianceStr = totalVariance.toLocaleString(
          "en-US",
          { style: "currency", currency: "USD" }
        );
    this.setState({totalVariance,totalVarianceStr})

    if (
      this.state.totalVariance === 0 ||
      isNaN(this.state.totalVariance) 
    ) {
      // this.setState({
      //   msg: "No Financial Data Found for the Given Product ID!".toUpperCase(),
      // });
      this.setState({ tableVisibility: true });
    } else {
      this.setState({msg: '', tableVisibility: true });
    }

    setTimeout(() => {
      this.setState({ msg: " " });
    }, 3000);
  };

  onChange = async (e) => {
    this.setState({
      id: this.productIdRef.current.value,
    });
  };
  render() {
    if (true) {
      // return (
      //   <div>

      //     <h1 style={{ fontSize: '3em', color: '#f2f2f2' }}><span role="img" aria-label="construction">🚧</span> <br />UNDER MAINTENANCE </h1>
      //     <p><em>This feature is currently under maintenance and will be back online soon.</em></p>
      //   </div>
      // );
    }
    let table;
    let acc = this.props.account;
    let cont1 = this.props.pcContract;
    let cont2 = this.props.pctContract;
    let web3 = this.props.Web3;

    if (!acc || !cont1 || !cont2 || !web3) {
      return <div> Loading..... </div>;
    }
    this.state.tableVisibility ? (table = "show") : (table = "hide");

    return (
      <div className="financial-status-container">
        <form onSubmit={this.onSubmit} className="form-container">
          <div className="form-row">
            <h4 style={{marginBottom: '10px'}}>Review Direct-Cost Quantity Variance</h4>
            <p style={{backgroundColor:'rgba(17, 17, 17, 0.873)' , padding: '19px' , borderRadius: '25px' , fontSize: '14px'}}>
              <em>**For simpilcity, It is assumed that the actual and standard product quantity are the same. As a result,
              quantity variance should evaluate to $0.00</em>
            </p>
            <label style={{ marginRight: "5px" }}> Product ID: </label>
            <input
              type="text"
              placeholder="e.g. pro101"
              value={this.state.id}
              onChange={this.onChange}
              ref={this.productIdRef}
              required="required"
            />
            <div>
              <input
                style={{ cursor: "pointer" }}
                type="submit"
                className="btn"
                value="VIEW VARIANCE"
              />
            </div>
          </div>
          <div className="query-result">
            <p> {this.state.msg} </p>
          </div>
          <div className={`${table} costsClashContainer `}>
            <div className="std-cost-container">
            <table className="cost-data" cellSpacing="90">
                <thead>
                  <tr>
                    <th>CATEGORY</th>
                    <th>PRICE VARIANCE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{borderBottom: '1px solid #999'}}>
                    <th>No of Production Units</th>
                    <td style={{textAlign:'center'}}>{`${this.state.actQty} units`}</td>
                  </tr>
                  <tr style={{borderBottom: '1px solid #999'}}>
                    <td colSpan="2">Direct Material Details </td>
                  </tr>
                  <tr>

                    <td>
                      {/* {`(${this.state.materialUnitActCost} per gram - ${this.state.materialUnitStdCost} per gram)  * ${this.state.actQty} grams = ${this.state.material}`} */}
                       {this.state.names}
                    </td>
                    <td>{this.state.qtyVarianceStrs}</td>
                  </tr>
                  <tr style={{borderTop:'1px solid #999', borderBottom: '1px solid #999'}}>
                    <td>total</td>
                    <td style={{textAlign:'left', paddingLeft: '50px'}}>{this.state.totalVarianceStr}</td>
                </tr>
                  {/* <tr>
                    <td> Direct Labor </td>
                    <td>
                      {`(${this.state.hourlyActRate} per hour - ${this.state.hourlyStdRate} per hour )  * ${this.state.workHrsActNo} hours = ${this.state.labor}`}
                    </td>
                  </tr> */}
                </tbody>
                <tfoot>
              
                </tfoot>
              </table>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

class FinancialLog extends Component {
  componentDidMount = () => {
    document.title = 'Cost Management | Pharma Chain'
  }
  render() {
    let acc = this.props.accounts;
    let cont1 = this.props.pcContract;
    let cont2 = this.props.pctContract;
    let web3 = this.props.web3;
    if (!acc || !cont1 || !cont2 || !web3) {
      return <div> Loading..... </div>;
    }

    return (
      <BrowserRouter>
        <div className="product-form-container">
          <div className="side-nav">
            <ul className="mini-nav-list">
              <li className="link-item">
                <NavLink to="/financial-log/setActualCosts">
                  MANAGE ACTUAL COSTS
                </NavLink>
              </li>
              <li className="link-item">
                <NavLink to="/financial-log/setFlexibleBudget">
                  MANAGE FLEXIBLE BUDGET
                </NavLink>
              </li>
              <label>
                <strong> REVIEW COST SHEET </strong>
              </label>
              <li className="link-item">
                <NavLink to="/financial-log/costSheetStd">
                  STANDARD
                </NavLink>
              </li>
              <li className="link-item">
                <NavLink to="/financial-log/costSheetAct">
                  ACTUAL
                </NavLink>
              </li>
              <label>
                <strong> REVIEW VARIANCE </strong>
              </label>
              <li className="link-item">
                <NavLink to="/financial-log/staticVariance">
                  STATIC-BUDGET
                </NavLink>
              </li>
              <li className="link-item">
                <NavLink to="/financial-log/flexibleVariance">
                  FLEXIBLE-BUDGET
                </NavLink>
              </li>
              <li className="link-item">
                <NavLink to="/financial-log/priceVariance">
                  PRICE/RATE
                </NavLink>
              </li>
              <li className="link-item">
                <NavLink to="/financial-log/quantityVariance">
                  QUANTITY/EFFICIENCY
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="main-content">
            <Route
              path="/financial-log/setActualCosts"
              exact
              render={(props) => (
                <SetActualCosts
                  {...props}
                  account={this.props.accounts}
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
                />
              )}
            />
            <Route
              path="/financial-log/setFlexibleBudget"
              exact
              render={(props) => (
                <SetFlexibleBudget
                  {...props}
                  account={this.props.accounts}
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
                />
              )}
            />
            {/* <Route
              path="/financial-log/setDirectCosts"
              exact
              render={(props) => (
                <SetDirectCosts
                  {...props}
                  Web3={this.props.web3}
                  account={this.props.accounts}
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
                />
              )}
            /> */}
            <Route
              path="/financial-log/staticVariance"
              exact
              render={(props) => (
                <CalculateStaticVariance
                  {...props}
                  Web3={this.props.web3}
                  account={this.props.accounts}
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
                />
              )}
            />
            <Route
              path="/financial-log/flexibleVariance"
              exact
              render={(props) => (
                <CalculateFlexibleVariance
                  {...props}
                  Web3={this.props.web3}
                  account={this.props.accounts}
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
                />
              )}
            />
            <Route
              path="/financial-log/priceVariance"
              exact
              render={(props) => (
                <CalculatePriceVariance
                  {...props}
                  Web3={this.props.web3}
                  account={this.props.accounts}
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
                />
              )}
            />
            <Route
              path="/financial-log/quantityVariance"
              exact
              render={(props) => (
                <CalculateQuantityVariance
                  {...props}
                  Web3={this.props.web3}
                  account={this.props.accounts}
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
                />
              )}
            />
            <Route
              path="/financial-log/costSheetAct"
              exact
              render={(props) => (
                <ReviewActCostSheet
                  {...props}
                  Web3={this.props.web3}
                  account={this.props.accounts}
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
                />
              )}
            />
            <Route
              path="/financial-log/costSheetStd"
              exact
              render={(props) => (
                <ReviewStdCostSheet
                  {...props}
                  Web3={this.props.web3}
                  account={this.props.accounts}
                  pcContract={this.props.pcContract}
                  pctContract={this.props.pctContract}
                />
              )}
            />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default FinancialLog;
