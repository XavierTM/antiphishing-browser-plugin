
import { Button, Fab, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import Page from "./Page";
import TimeAgo from 'react-timeago';
import axios from 'axios';
import { hideLoading, showLoading } from '../loading';



class Dashboard extends Page {


    state = {
        dataFetched: false,
        domains: []
    }


    fetchData = async () => {
        
        try {
            showLoading();

            const response = await axios.get('/api/blacklist');
            const domains = response.data;

            await this.updateState({ domains, dataFetched: true });
            hideLoading();

        } catch (err) {
            alert(String(err));
            hideLoading();
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    _render() {

        let JSX;
        const { dataFetched, domains } = this.state;

        if (dataFetched) {

            let emptyListJSX;

            if (domains.length === 0) {
                emptyListJSX = <p style={{ color: 'grey', fontSize: 30 }}>
                    No domains blacklisted yet.
                </p>
            }

            JSX = <>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>DOMAIN</b></TableCell>
                            <TableCell><b>COUNT</b></TableCell>
                            <TableCell><b>FIRST ENTRY</b></TableCell>
                            <TableCell><b>LAST ENTRY</b></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {
                            domains.map(domain => {
                                
                                return <TableRow>
                                    <TableCell>{domain.domain}</TableCell>
                                    <TableCell>{domain.count}</TableCell>

                                    <TableCell>
                                        <TimeAgo date={domain.createdAt} />
                                    </TableCell>
                                    
                                    <TableCell>
                                        <TimeAgo date={domain.updatedAt} />
                                    </TableCell>
                                </TableRow>
                            })
                        }
                    </TableBody>
                </Table>

                {emptyListJSX}

                <Fab 
                    style={{
                        position: 'fixed',
                        bottom: 30,
                        right: 30
                    }}
                    onClick={this.fetchData}
                >
                    <RefreshIcon />
                </Fab>

            </>
        } else {
            JSX = <div className="vh-align" style={{ height: 'calc(var(--window-height) - var(--navbar-height))' }}>
                <div style={{ width: 300, textAlign: 'center' }}>
                    <p style={{ color: 'grey', fontSize: 30 }}>
                        Something went wrong.
                    </p>

                    <Button onClick={this.fetchData}>
                        RELOAD
                    </Button>
                </div>
            </div>
        }

        return JSX;
    }
}

export default Dashboard;