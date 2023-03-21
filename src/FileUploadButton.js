import React, {ChangeEvent, useState} from 'react';
import axios from "axios"
import {Button, Modal, Tab, Tabs} from 'react-bootstrap'
import ClipLoader from "react-spinners/ClipLoader";
import {pieData} from "./PieChartComponent";
import PieChartComponent from "./PieChartComponent";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GatlingPieChart, {gatlingData} from "./GatlingPieChart";
import SeleniumPieChart, {seleniumData} from "./SeleniumPieChart";

let key = 0

const FileUploadButton = (props) => {
    const theme = props.theme
    // const widthNum = window.innerWidth / 3 - 100
    // const width = widthNum.toString() + "px"

    const [projectZip, setProjectZip] = useState();
    const [testZip, setTestZip] = useState();

    const [show, setShow] = useState(false)
    const [showPieChart, setShowPieChart] = useState(false)
    const [results, setResults] = useState('none')
    const [projectRes, setProjectRes] =  useState('none')
    const [seleniumRes, setSeleniumRes] =  useState('')

    let [loading, setLoading] = useState(false);

    const handleProjectZipChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setProjectZip(e.target.files[0]);
        }
    };

    const handleTestZipChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setTestZip(e.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        setShowPieChart(false)
        if (!projectZip) {
            return;
        }
        if (!testZip) {
            return;
        }
        setLoading(true)
        sendFiles()
        //handleShow()
    };

    const handleClose = () => {
        key=key+1
        setShow(false)
        setShowPieChart(true)
    }

    const handleShow = async() => {
        // await timeout(3000);
        // setShow(true)
        setLoading(false)
        key=key+1
        setShowPieChart(true)
        //key=key+1
        //setShowPieChart(true)
    }

    const sendFiles = async() => {
        //send file to backend to get the results
        const projectFormData = new FormData();
        projectFormData.append('file', projectZip);

        const testFormData = new FormData();
        testFormData.append('file', testZip);

        //send project zip
        await axios.post("http://localhost:8080/tests/swagger/getEndPoints", projectFormData, {
            headers: {
                'Content-Type': 'multipart/form-data'
              },
        }).then((res) => {
            //console.log(res.data)
            //JSON.parse(res.data).forEach(element => console.log(element.method))
            const responseString = res.data.reduce((acc, obj) => {
                return acc + `${obj.method} ${obj.path}\n`
            }, '')
            setProjectRes(responseString)
        }).catch((err) => console.error(err))

        //sent testZip
        await axios.post("http://localhost:8080/tests/gatling/getAll", testFormData, {
            headers: {
                'Content-Type': 'multipart/form-data'
              },
        }).then((res) => {
            console.log(res.data)
            //setResults(res.data)
            const responseString = res.data.reduce((acc, obj) => {
                return acc + `${obj.method} ${obj.path}\n`
            }, '')
            setResults(responseString)
        }).catch((err) => console.error(err))

        // await axios.post("http://localhost:8080/tests/selenium/getAll", testFormData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     },
        // }).then((res) => {
        //     console.log(res.data)
        //     //setResults(res.data)
        //     const responseString = res.data.reduce((acc, obj) => {
        //         return acc + `${obj.method} ${obj.path}\n`
        //     }, '')
        //     setSeleniumRes(responseString)
        setSeleniumRes(seleniumRes)
        // }).catch((err) => console.error(err))

        await axios.get(`http://localhost:8080/tests/coverage/getTotal`)
            .then(res => {
                console.log(res.data)
                pieData.at(0).value = res.data
            }).catch((err) => console.error(err))

        await axios.get(`http://localhost:8080/tests/coverage/getPartial`)
            .then(res => {
                console.log(res.data)
                pieData.at(1).value = res.data
                // gatlingData.at(0).value = res.data
            }).catch((err) => console.error(err))

        await axios.get(`http://localhost:8080/tests/coverage/getNo`)
            .then(res => {
                console.log(res.data)
                pieData.at(2).value = res.data
                // gatlingData.at(1).value = res.data
            }).catch((err) => console.error(err))

        await axios.get(`http://localhost:8080/tests/coverage/getGatlingCovered`)
            .then(res => {
                console.log(res.data)
                // pieData.at(2).value = res.data
                gatlingData.at(0).value = res.data
            }).catch((err) => console.error(err))

        await axios.get(`http://localhost:8080/tests/coverage/getGatlingUncovered`)
            .then(res => {
                console.log(res.data)
                // pieData.at(2).value = res.data
                gatlingData.at(1).value = res.data
            }).catch((err) => console.error(err))

        await axios.get(`http://localhost:8080/tests/coverage/getSeleniumCovered`)
            .then(res => {
                console.log(res.data)
                // pieData.at(2).value = res.data
                seleniumData.at(0).value = res.data
            }).catch((err) => console.error(err))

        await axios.get(`http://localhost:8080/tests/coverage/getSeleniumUncovered`)
            .then(res => {
                console.log(res.data)
                // pieData.at(2).value = res.data
                seleniumData.at(1).value = res.data
            }).catch((err) => console.error(err))

        // setLoading(false)
        handleShow()

        // setLoading(false)
        handleShow()

        // setShow(false)
        // await timeout(1000);

        this.forceUpdate()
    }

    return (
        <div>
            <p>Upload project.zip</p>
            <input 
            type="file" 
            onChange={handleProjectZipChange} 
            accept=".zip"
            />
            <div>{projectZip && `${projectZip.name} - ${projectZip.type}`}</div>
            
            <br/>
            <br/>
            
            <p>Upload tests.zip</p>
            <input 
            type="file" 
            onChange={handleTestZipChange} 
            accept=".zip"/>
            <div>{testZip && `${testZip.name} - ${testZip.type}`}</div>
            
            <br/>

            <Button variant={theme === 'light' ? "primary" : "dark"} onClick={handleUploadClick}>Upload</Button>
            <ClipLoader
                color={"blue"}
                loading={loading}
                size={18}
                aria-label="Loading Spinner"
                data-testid="loader"
            />

            <Container fluid>
                <Row>
                    <Col>
                        <div key={key} style={{maxWidth: "380px", whiteSpace: 'pre'}}>
                            {showPieChart ?
                                <h3>Total Coverage</h3>
                                : null}
                            {showPieChart ?
                                <PieChartComponent />
                            : null}
                            {showPieChart ?
                                <div style={{maxWidth: "380px", whiteSpace: 'pre'}}>
                                    <textarea cols="50" readOnly="true" rows={projectRes.split(/\r\n|\r|\n/).length}>{projectRes}</textarea>
                                </div>
                                : null}
                        </div>
                    </Col>
                    <Col>
                        <div key={key} style={{maxWidth: "380px", whiteSpace: 'pre'}}>
                            {showPieChart ?
                                <h3>Gatling</h3>
                                : null}
                            {showPieChart ?
                                <GatlingPieChart />
                                : null}
                            {showPieChart ?
                                <div style={{maxWidth: "380px", whiteSpace: 'pre'}}>
                                    <textarea cols="50" readOnly="true" rows={results.split(/\r\n|\r|\n/).length}>{results}</textarea>
                                </div>
                                : null}
                        </div>
                    </Col>
                    <Col>
                        <div key={key} style={{maxWidth: "380px", whiteSpace: 'pre'}}>
                            {showPieChart ?
                                <h3>Selenium</h3>
                                : null}
                            {showPieChart ?
                                <SeleniumPieChart />
                                : null}
                            {showPieChart ?
                                <div style={{maxWidth: "380px", whiteSpace: 'pre'}}>
                                    <textarea cols="50" readOnly="true" rows={seleniumRes.split(/\r\n|\r|\n/).length}>{seleniumRes}</textarea>
                                </div>
                                : null}
                        </div>
                    </Col>
                </Row>
            </Container>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Endpoints Tested</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs
                        id="controlled-tab"
                        className="group-01"
                    >
                        <Tab eventKey="gatling" title="Gatling">
                            <div style={{ whiteSpace: 'pre' }}>
                                {results}
                            </div>
                        </Tab>
                        <Tab eventKey="swagger" title="Swagger">
                            <div style={{ whiteSpace: 'pre' }}>
                                {projectRes}
                            </div>
                        </Tab>
                        <Tab eventKey="selenium" title="Selenium">
                            <div style={{ whiteSpace: 'pre' }}>
                                {seleniumRes}
                            </div>
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleClose}>
                      Ok
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default FileUploadButton;
