import React, { Component } from "react";
import {
    Page,
    Card,
    Banner,
    Label,
    Button,
    Modal,
    TextField
} from "@shopify/polaris";
import { requests } from "../../../../services/request";
import { notify } from "../../../../services/notify";

class ConnectedAccounts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apps: [],
            modalAccountConnetct: false,
            accountName: "",
            accountConnect_Data: []
        };
    }
    componentWillMount() {
        requests.getRequest("connector/get/all").then(data => {
            if (data.success) {
                let installedApps = [];
                let shopName = [];
                for (let i = 0; i < Object.keys(data.data).length; i++) {
                    if (data.data[Object.keys(data.data)[i]].installed === 1) {
                        if (
                            data.data[Object.keys(data.data)[i]].code !==
                            "google"
                        )
                            shopName.push(data.data[Object.keys(data.data)[i]]);
                    }
                }
                requests
                    .postRequest(
                        "frontend/app/getInstalledConnectorDetails",
                        shopName
                    )
                    .then(DATA => {
                        if (DATA.success) {
                            this.setState({
                                apps: DATA.data
                            });
                        } else {
                            notify.error(data.message);
                        }
                    });
            } else {
                notify.error(data.message);
            }
        });
    }
    handleconnectAccount(e, marketCode) {
        // console.log(marketCode);
        // console.log(e);
        let data = {
            code: marketCode,
            connectAccountName: e
        };
        requests
            .postRequest("frontend/test/updateVariantsOfScrapping", data)
            .then(res => {
                // console.log(res);
                // this.state.accountConnect_Data=res.data;
                this.setState({ accountConnect_Data: res.data });
            });
        this.setState({
            modalAccountConnetct: !this.state.modalAccountConnetct
        });
    }
    handleTextFieldChangeacount(e, choose) {
        // console.log(e);
        // console.log(choose);
        let accountDetails = this.state.accountConnect_Data;
        // this.state.accountConnect_Data.account_name=e;
        accountDetails.account_name = choose;
        this.setState({ accountDetails: accountDetails });
        // this.setState({accountConnect_Data:e})
    }
    render() {
        return (
            <Page
                title="Accounts"
                primaryAction={{
                    content: "Back",
                    onClick: () => {
                        this.redirect("/panel/accounts");
                    }
                }}
            >
                {this.state.apps.map(app => {
                    return (
                        <Card
                            title={app.title}
                            key={this.state.apps.indexOf(app)}
                        >
                            <div className="p-5">
                                <img
                                    src={app.image}
                                    alt={app.title}
                                    height={"100px"}
                                />
                                {app.shops.map((keys, index) => {
                                    return app.code == "amazonimporter" ? (
                                        <Banner
                                            status="info"
                                            icon="checkmark"
                                            key={index}
                                        >
                                            <Button
                                                plain
                                                onClick={this.handleconnectAccount.bind(
                                                    this,
                                                    keys.shop_url,
                                                    app.code
                                                )}
                                            >
                                                {keys.shop_url}
                                            </Button>
                                        </Banner>
                                    ) : (
                                        <Banner
                                            status="info"
                                            icon="checkmark"
                                            key={index}
                                        >
                                            <Label id={123}>
                                                {keys.shop_url}
                                            </Label>
                                        </Banner>
                                    );
                                })}
                            </div>
                        </Card>
                    );
                })}
                <Modal
                    open={this.state.modalAccountConnetct}
                    onClose={() =>
                        this.setState({
                            modalAccountConnetct: !this.state
                                .modalAccountConnetct
                        })
                    }
                    title="Account Connected Details"
					primaryAction={{
                   content: 'Close',
                    onAction: ()=>this.setState({
                            modalAccountConnetct: !this.state
                                .modalAccountConnetct
                        }),
        }}
                >
                    <Modal.Section>
                        <Banner title="Note" status="info">
                            <Label>
                                Connect your another amazon account to import
                                it's products also, just give another different
                                account name
                            </Label>
                            <Banner status="success">
                                {this.state.accountConnect_Data.account_name}
                            </Banner>
                        </Banner>
                        <br />
                        <TextField
                            label="Account Name(Give account Name to this connection)"
                            type="text"
                            value={this.state.accountConnect_Data.account_name}
                            // onChange={this.handleTextFieldChangeacount.bind(this,this.state.accountConnect_Data.account_name)}
                            helpText="Connect your another amazon account  Name if you need to contact our services about your account."
                        />
                        <br />
                        <TextField
                            label="Access Key(Give access Key to this connection)"
                            type="text"
                            value={this.state.accountConnect_Data.access_key}
                            // onChange={this.handleTextFieldChangeacount.bind(this,this.state.accountConnect_Data.account_name)}
                        />
                        <br />
                        <TextField
                            label="Secret Key(Give Secret Key to this connection)"
                            type="text"
                            value={this.state.accountConnect_Data.secret_key}
                            // onChange={this.handleTextFieldChangeacount.bind(this,this.state.accountConnect_Data.account_name)}
                
                        />
                        <br />
                        <TextField
                            label="Token(Give token to this connection)"
                            type="text"
                            value={this.state.accountConnect_Data.token}
                            // onChange={this.handleTextFieldChangeacount.bind(this,this.state.accountConnect_Data.account_name)}
                
                        />
                        <br />
                        <TextField
                            label="Seller Id(Give seller id to this connection)"
                            type="text"
                            value={this.state.accountConnect_Data.seller_id}
                            // onChange={this.handleTextFieldChangeacount.bind(this,this.state.accountConnect_Data.account_name)}
                
                        />
                        <br />
                        <TextField
                            label="Country Code(Give country code to this connection)"
                            type="text"
                            value={this.state.accountConnect_Data.country_code}
                            // onChange={this.handleTextFieldChangeacount.bind(this,this.state.accountConnect_Data.account_name)}
                
                        />
                        <br />
                        {this.state.accountConnect_Data.auto_sync == 0 ? (
                            <TextField
                                label="Auto Sync(Account auto Sync details)"
                                type="text"
                                value="No"
                                // onChange={this.handleTextFieldChangeacount.bind(this,this.state.accountConnect_Data.account_name)}
                                // helpText="We’ll use/ this address if we need to contact you about your account."
                            />
                        ) : (
                            <TextField
                                label="Auto Sync(Give any name to this connection)"
                                type="text"
                                value="yes"
                                // onChange={this.handleTextFieldChangeacount.bind(this,this.state.accountConnect_Data.account_name)}
                                // helpText="We’ll use/ this address if we need to contact you about your account."
                            />
                        )}
                    </Modal.Section>
                </Modal>
            </Page>
        );
    }
    redirect(url) {
        this.props.history.push(url);
    }
}

export default ConnectedAccounts;
