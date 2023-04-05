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
import RegexInput from "./RegexInput";

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

    const [fullSwagger, setFullSwagger] = useState('')
    const [partialSwagger, setPartialSwagger] = useState('')
    const [noSwagger, setNoSwagger] = useState('')
    const [fullGatling, setFullGatling] = useState('')
    const [noGatling, setNoGatling] = useState('')
    const [fullSelenium, setFullSelenium] = useState('')
    const [noSelenium, setNoSelenium] = useState('')

    const [showField, setShowField] = useState(false)
    const [showRegex, setShowRegex] = useState(false)
    const [field, setField] = useState('')
    const [fieldError, setFieldError] = useState('')
    const [regex, setRegex] = useState([''])
    const maxRegex = 10;
    const [regexErrorText, setRegexErrorText] = useState('')
    const percentagePer = 1.0/18.0
    const [percentage, setPercentage] = useState(0.0)

    const fieldPrompt = "Field:  "

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
        setField('')
        setShowField(true)
        setRegex([''])
        // setLoading(true)
        // sendFiles()
        //handleShow()
    };

    const handleClose = () => {
        key=key+1
        setShow(false)
        setShowPieChart(true)
    }

    const handleFieldClose = () => {
        key=key+1
        setShowField(false)
        setShowRegex(false)
    }

    const handleNext = () => {
        if (field === '') {
            setFieldError('* Field is required *')
            return;
        }
        setRegexErrorText('')
        setFieldError('')
        setShowRegex(true)
        setShowField(false)
    }

    const handlePrev = () => {
        setShowField(true)
        setShowRegex(false)
    }

    const handleDone = () => {
        if (regex.length === 0) {
            return;
        }
        let i =0;
        setRegexErrorText('')
        while (i < regex.length) {
            if (regex[i] === '') {
                setRegexErrorText("* No entries may be left blank *")
                return;
            }
            i++;
        }

        setShowRegex(false)
        setShowPieChart(false)
        setLoading(true)
        sendFiles()
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

    const handleFieldChange = (event) => {
        setField(event.target.value)
        if (field.length > 0) {
            setFieldError('')
        }
    }

    const handleAdd = (event) => {
        event.preventDefault()
        const values = [...regex];
        values.push('');
        setRegex(values);
    };

    const handleDelete = (event, index) => {
        const values = [...regex];
        values.splice(index, 1);
        setRegex(values)
    };

    const handleRegexChange = (event, index) => {
        const values = [...regex];
        values[index] = event.target.value
        setRegex(values)
        let i =0;
        setRegexErrorText('')
        while (i < regex.length) {
            if (regex[i] === '') {
                setRegexErrorText("* No entries may be left blank *")
                return;
            }
            i++;
        }
    };

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
        setSeleniumRes('')
        // }).catch((err) => console.error(err))

        await axios.post("http://localhost:8080/requests/logs/field", {field: field})
            .then((response) => {
            console.log(response);
        });
            // .catch((err) => console.error(err))

        await axios.post("http://localhost:8080/requests/logs/regexList", regex)
            .then((response) => {
                console.log(response);
            });

        await axios.get(`http://localhost:8080/tests/coverage/getPartial`)
            .then(res => {
                console.log(res.data)
                pieData.at(1).value = res.data
                // gatlingData.at(0).value = res.data
            }).catch((err) => console.error(err))

        await axios.get(`http://localhost:8080/tests/coverage/getTotal`)
            .then(res => {
                console.log(res.data)
                pieData.at(0).value = res.data
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

        await axios.get("http://localhost:8080/tests/coverage/getFullSwagger")
            .then((res) => {
                console.log(res.data)
                //setResults(res.data)
                const responseString = res.data.reduce((acc, obj) => {
                    return acc + `${obj}\n`
                }, '')
                setFullSwagger(responseString)
            }).catch((err) => console.error(err))

        await axios.get("http://localhost:8080/tests/coverage/getPartialSwagger")
            .then((res) => {
            console.log(res.data)
            //setResults(res.data)
            const responseString = res.data.reduce((acc, obj) => {
                return acc + `${obj}\n`
            }, '')
            setPartialSwagger(responseString)
        }).catch((err) => console.error(err))

        await axios.get("http://localhost:8080/tests/coverage/getNoSwagger")
            .then((res) => {
                console.log(res.data)
                //setResults(res.data)
                const responseString = res.data.reduce((acc, obj) => {
                    return acc + `${obj}\n`
                }, '')
                setNoSwagger(responseString)
            }).catch((err) => console.error(err))

        await axios.get("http://localhost:8080/tests/coverage/getFullGatling")
            .then((res) => {
                console.log(res.data)
                //setResults(res.data)
                const responseString = res.data.reduce((acc, obj) => {
                    return acc + `${obj}\n`
                }, '')
                setFullGatling(responseString)
            }).catch((err) => console.error(err))

        await axios.get("http://localhost:8080/tests/coverage/getNoGatling")
            .then((res) => {
                console.log(res.data)
                //setResults(res.data)
                const responseString = res.data.reduce((acc, obj) => {
                    return acc + `${obj}\n`
                }, '')
                setNoGatling(responseString)
            }).catch((err) => console.error(err))

        await axios.get("http://localhost:8080/tests/coverage/getFullSelenium")
            .then((res) => {
                console.log(res.data)
                //setResults(res.data)
                const responseString = res.data.reduce((acc, obj) => {
                    return acc + `${obj}\n`
                }, '')
                setFullSelenium(responseString)
            }).catch((err) => console.error(err))

        await axios.get("http://localhost:8080/tests/coverage/getNoSelenium")
            .then((res) => {
                console.log(res.data)
                //setResults(res.data)
                const responseString = res.data.reduce((acc, obj) => {
                    return acc + `${obj}\n`
                }, '')
                setNoSelenium(responseString)
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
            {/*<div>*/}
            {/*    {regex.map((current) =>*/}
            {/*        <div>{current}</div>*/}
            {/*    )}*/}
            {/*</div>*/}

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
                                    <textarea style={{color: "green"}} cols="50" readOnly="true" rows={fullSwagger.split(/\r\n|\r|\n/).length}>{fullSwagger}</textarea>
                                </div>
                                : null}
                            {showPieChart ?
                                <div style={{maxWidth: "380px", whiteSpace: 'pre'}}>
                                    <textarea style={{color: "gold"}} cols="50" readOnly="true" rows={partialSwagger.split(/\r\n|\r|\n/).length}>{partialSwagger}</textarea>
                                </div>
                                : null}
                            {showPieChart ?
                                <div style={{maxWidth: "380px", whiteSpace: 'pre'}}>
                                    <textarea style={{color: "red"}} cols="50" readOnly="true" rows={noSwagger.split(/\r\n|\r|\n/).length}>{noSwagger}</textarea>
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
                                    <textarea style={{color: "green"}} cols="50" readOnly="true" rows={fullGatling.split(/\r\n|\r|\n/).length}>{fullGatling}</textarea>
                                </div>
                                : null}
                            {showPieChart ?
                                <div style={{maxWidth: "380px", whiteSpace: 'pre'}}>
                                    <textarea style={{color: "red"}} cols="50" readOnly="true" rows={noGatling.split(/\r\n|\r|\n/).length}>{noGatling}</textarea>
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
                                    <textarea style={{color: "green"}} cols="50" readOnly="true" rows={fullSelenium.split(/\r\n|\r|\n/).length}>{fullSelenium}</textarea>
                                </div>
                                : null}
                            {showPieChart ?
                                <div style={{maxWidth: "380px", whiteSpace: 'pre'}}>
                                    <textarea style={{color: "red"}} cols="50" readOnly="true" rows={noSelenium.split(/\r\n|\r|\n/).length}>{noSelenium}</textarea>
                                </div>
                                : null}
                        </div>
                    </Col>
                </Row>
            </Container>

            <Modal show={showField} onHide={handleFieldClose}>
                <Modal.Header>
                    <Modal.Title>Selenium Field</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <label>
                            {fieldPrompt}
                            {/*<textarea value={field} onChange={handleFieldChange}></textarea>*/}
                            <input value={field} onChange={handleFieldChange}/>
                        </label>
                    </form>

                    <div>
                        <h8 style={{ color: 'red' }}>{fieldError}</h8>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleFieldClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleNext}>
                        Next
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showRegex} onHide={handleFieldClose}>
                <Modal.Header>
                    <Modal.Title>Selenium Field</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        {/*<label>*/}
                        {/*    {fieldPrompt}*/}
                        {/*    test*/}
                        {/*    <textarea value={field} onChange={handleFieldChange}></textarea>*/}
                        {/*    <input value={field} onChange={handleFieldChange}/>*/}
                        {/*</label>*/}
                        {regex.map((obj, index) => (
                            <div className="whole-input">
                                <div className="input-box">
                                    <RegexInput
                                        key = {index}
                                        objValue={obj.toString()}
                                        onChange={handleRegexChange}
                                        index={index}
                                        deleteField={handleDelete}
                                        regex={regex}
                                    />
                                </div>
                                <div className="error-text">
                                    {/*{regexErrorText[index]}*/}
                                    {/*<h8 style={{ color: 'red' }}>{regexErrorText}</h8>*/}
                                </div>
                            </div>
                        ))}
                        <h8 style={{ color: 'red' }}>{regexErrorText}</h8>
                    </form>

                    <div>
                        {/*{regex.toString()}*/}
                        {/*{regex.map((current) =>*/}
                        {/*    <div>*/}
                        {/*        <input value={current} onChange={handleRegexChange}/>*/}
                        {/*        <Button variant="danger" onClick={handleDelete} disabled={regex.length <= 1}>*/}
                        {/*            Delete*/}
                        {/*        </Button>*/}
                        {/*    </div>*/}
                        {/*)}*/}
                    </div>



                    <Button variant="warning" disabled={regex.length >= maxRegex} onClick={handleAdd}>
                        Add
                    </Button>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleFieldClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handlePrev}>
                        Prev
                    </Button>
                    <Button variant="success" onClick={handleDone}>
                        Done
                    </Button>
                </Modal.Footer>
            </Modal>

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
