import React, { Fragment } from 'react';
import Cookies from 'js-cookie';
import { Popup, Card, Button, Label, Icon, Pagination, Dropdown, Header, Container, Item, Segment } from 'semantic-ui-react';
import moment from 'moment';
export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this)
    }
    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        //url: 'http://localhost:51689/listing/listing/closeJob',
        $.ajax({
            url: `http://localhost:51689/listing/listing/closeJob/`,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            type: "post",
            data: JSON.stringify(id = id),
            success: function (res) {
                if (res.success == true) {
                    TalentUtil.notification.show(res.message, "success", null, null);
                    window.location = "/ManageJobs";
                } else {
                    TalentUtil.notification.show(res.message, "error", null, null)
                }
            }.bind(this)
        })
    }
    render() {
        return (
            <Fragment>
                {this.props.jobs.length === 0 ? <h1>No Jobs Found</h1> : <Card.Group itemsPerRow={3}>
                    {this.props.jobs.map((job, index) => <Card key={index}>
                        <Card.Content>
                            <Card.Header>{job.title}</Card.Header>
                            <Label as='a' color='black' ribbon='right'>
                                <Icon name="user" /> {job.noOfSuggestions}
                            </Label>
                            <Card.Meta>
                                {job.location.city}, {job.location.country}
                            </Card.Meta>
                        </Card.Content>
                        <Card.Content>
                            <Card.Description>
                                {job.summary}
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            {new Date(job.expiryDate) < new Date(new Date().toDateString()) ? <Button size='mini' color='red' >Expired</Button> : <div></div>}
                            <Button.Group floated="right" size='mini'>
                                <Button size='mini' disabled={Boolean(job.status)} icon basic color='blue' onClick={() => this.selectJob(job.id)}> <Icon name="ban" />Close</Button>
                                {job.status === 1 ? <Button disabled={Boolean(job.status)} size='mini' icon basic color='blue'><Icon name='edit' />Edit</Button> :
                                    <a href={`/EditJob/${job.id}`} ><Button size='mini' icon basic color='blue'><Icon name='edit' />Edit</Button></a>
                                }
                                <Button size='mini' icon basic color='blue'><Icon name='copy' />Copy</Button>
                            </Button.Group>
                        </Card.Content>
                    </Card>)}
                </Card.Group>
                }
                <br />
                <Container textAlign="right"  >
                    <Pagination
                        defaultActivePage={this.props.activePage}
                        totalPages={this.props.totalPages}
                        siblingRange={1}
                        onPageChange={(e, d) => this.props.onActivePageChange(d.activePage)}
                        boundaryRange={0} />
                </Container>
                <br />
            </Fragment>
        )
    }
}