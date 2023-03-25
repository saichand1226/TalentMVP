import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Header, Container } from 'semantic-ui-react';
export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: true,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
        this.onChechboxChange = this.onChechboxChange.bind(this);
        this.onSortDateHandler = this.onSortDateHandler.bind(this);
        this.findDefaultValue = this.findDefaultValue.bind(this);
        this.onActivePageChange = this.onActivePageChange.bind(this);
    };
    onActivePageChange(value){
     const data = Object.assign({}, this.state)
        data['activePage'] = value
        this.setState({
            activePage: value
        })
        this.loadNewData(data)
    }
    findDefaultValue(dateOptions){
        const {key} = dateOptions.find((x) => x.value === this.state.sortBy.date);
        return key;
    }
    onSortDateHandler(event, data){
        const { sortBy } = this.state;
        sortBy.date = data.value;
        this.setState({sortBy})
this.init();
    }
    onChechboxChange(event, data){
        const {filter} = this.state;
        filter[data.label] = !this.state.filter[data.label];
        this.setState({filter})
        this.init()
    }
    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
       //this.setState({ loaderData });//comment this
        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
           this.setState({ loaderData })
        )
    }
    componentDidMount() {
        this.init();
    };
    loadData(callback) {
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
       // your ajax call and other logic goes here
          $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            data : {
                 activePage: this.state.activePage,
            sortbyDate: this.state.sortBy.date,
            showActive: this.state.filter.showActive,
            showClosed: this.state.filter.showClosed,
            showDraft: this.state.filter.showDraft,
            showExpired: this.state.filter.showExpired,
            showUnexpired: this.state.filter.showUnexpired,
            },
            dataType: "json",
            success: function (res) {
                this.setState({loadJobs : res.myJobs, totalPages : Math.ceil(res.totalCount/6)});
               callback()
            }.bind(this),
            error: function (res) {
                console.log(res.status)
                callback()
            }
        })
    }
    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }
    render() {
      const  dateOptions = [
  {
    key: 'Newest first',
    text: 'Newest first',
    value: 'desc',
  },
  {
    key: 'Oldest first',
    text: 'Oldest first',
    value: 'asc',
  }
      ]
const sortOptions = [
  {
    key: 'showActive',
    text: 'Active',
    value: 'showActive',
  },
  {
    key: 'showClosed',
    text: 'Closed',
    value: 'showClosed',
  },
  {
    key: 'showDraft',
    text: 'Draft',
    value: 'showDraft',
  },
  {
    key: 'showExpired',
    text: 'Expired',
    value: 'showExpired',
  },
  {
    key: 'Unexpired',
    text: 'showUnexpired',
    value: 'showUnexpired',
  },
]
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <React.Fragment>
                <h1> List of Jobs</h1>
<Header as='h6'>
    <Icon name='filter' />
    <Header.Content>
      Filter:
      <Dropdown
      multiple
      simple
      item
      inline
      text="Choose filter"
      options={sortOptions.map((opt)=><Dropdown.Item key={opt.key}><Checkbox  onChange={(event, data)=>this.onChechboxChange(event,data)}label={opt.value} defaultChecked={this.state.filter[opt.value]}/></Dropdown.Item>)}
      />
    </Header.Content>
    <Icon name='calendar' />
    <Header.Content>
      Sort by date:
      <Dropdown
      simple
      item
        inline
        text={this.findDefaultValue(dateOptions)}
        options={dateOptions}
        defaultValue={dateOptions[0].value}
        onChange={(event, data) => this.onSortDateHandler(event, data)}
      />
    </Header.Content>
  </Header>
               <div className ="ui container"><JobSummaryCard activePage={this.state.activePage} totalPages={this.state.totalPages} onActivePageChange={this.onActivePageChange} jobs={this.state.loadJobs}/></div>
                    </React.Fragment>
            </BodyWrapper>
        )
    }
}