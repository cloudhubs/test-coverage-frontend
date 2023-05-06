import React, {ChangeEvent, useState} from 'react';
import axios from "axios"
import {Button, Modal, Tab, Tabs} from 'react-bootstrap'
import ClipLoader from "react-spinners/ClipLoader";
import PieChartComponent, {pieData} from "./PieChartComponent";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GatlingPieChart, {gatlingData} from "./GatlingPieChart";
import SeleniumPieChart, {seleniumData} from "./SeleniumPieChart";
import RegexInput from "./RegexInput";

let projectKey = 0

const FileUploadButton = (props) => {
    const theme = props.theme
    const max380 = {maxWidth: "380px", whiteSpace: 'pre'}
    const alignCenter = {textAlign: "center"}

    const [projectZip, setProjectZip] = useState();
    const [testZip, setTestZip] = useState();
    const [selZip, setSelZip] = useState();

    const [show, setShow] = useState(false)
    const [showPieChart, setShowPieChart] = useState(false)
    const [results, setResults] = useState('none')
    const [projectRes, setProjectRes] =  useState('none')
    const [seleniumRes, setSeleniumRes] =  useState('')

    let [loading, setLoading] = useState(false);

    const [fullSwagger, setFullSwagger] = useState('')
    const [partialSwagger, setPartialSwagger] = useState('')
    // const [noSwagger, setNoSwagger] = useState('')
    const [fullGatling, setFullGatling] = useState('')
    // const [noGatling, setNoGatling] = useState('')
    const [fullSelenium, setFullSelenium] = useState('')
    // const [noSelenium, setNoSelenium] = useState('')

    const [showField, setShowField] = useState(false)
    const [showRegex, setShowRegex] = useState(false)
    const [methodField, setMethodField] = useState('')
    const [urlField, setUrlField] = useState('')
    const [fieldError, setFieldError] = useState('')
    const [regex, setRegex] = useState([''])
    const maxRegex = 10;
    const [regexErrorText, setRegexErrorText] = useState('')

    /** Map stuffs */
    const [swaggerMap, setSwaggerMap] = useState([])
    const [swaggerCollapse, setSwaggerCollapse] = useState([])
    const [gatlingCollapse, setGatlingCollapse] = useState([])
    const [seleniumCollapse, setSeleniumCollapse] = useState([])
    const [expandAllList, setExpandAllList] = useState([false, false, false])
    const [textExpand, setTextExpand] = useState([false, false, false])
    const [expandStatusList, setExpandStatusList] = useState(Array(3).fill("Expand All"))
    const [gatlingSplit, setGatlingSplit] = useState([''])
    const [seleniumSplit, setSeleniumSplit] = useState([''])
    const [swaggerSplit, setSwaggerSplit] = useState([''])
    const [gatlingPct, setGatlingPct] = useState([])
    const [seleniumPct, setSeleniumPct] = useState([])
    const [swaggerPct, setSwaggerPct] = useState([])

    const [jsonStr, setJsonStr] = useState('')
    const [jsonButton] = useState('JSON')
    const [jsonBool, setJsonBool] = useState(false)

    const methodFieldPrompt = "Method Field:  "
    const urlFieldPrompt = "URL Field:  "

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

    const handleSelZipChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelZip(e.target.files[0]);
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
        setMethodField('')
        setUrlField('')
        // setShowField(true)
        setRegex([''])
        setExpandStatusList(Array(3).fill("Expand All"))
        setTextExpand([false, false, false])

        setSwaggerCollapse(Array(Object.keys(swaggerMap).length).fill(false))
        setGatlingCollapse(Array(Object.keys(swaggerMap).length).fill(false))
        setSeleniumCollapse(Array(Object.keys(swaggerMap).length).fill(false))

        setExpandAllList([false, false, false])
        setLoading(true)
        sendFiles()
        // setLoading(true)
        // sendFiles()
        // handleShow()
    };

    const handleClose = () => {
        projectKey=projectKey+1
        setShow(false)
        setShowPieChart(true)
    }

    const handleFieldClose = () => {
        projectKey=projectKey+1
        setShowField(false)
        setShowRegex(false)
    }

    const handleNext = () => {
        if (methodField === '') {
            setFieldError('* Method Field is required *')
            return;
        }
        if (urlField === '') {
            setFieldError('* URL Field is required *')
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
        projectKey=projectKey+1
        setShowPieChart(true)

        //key=key+1
        //setShowPieChart(true)
    }

    const handleMethodFieldChange = (event) => {
        setMethodField(event.target.value)
        if (methodField.length > 0) {
            setFieldError('')
        }
    }
    const handleUrlFieldChange = (event) => {
        setUrlField(event.target.value)
        if (urlField.length > 0) {
            setFieldError('')
        }
    }

    const handleAdd = (event) => {
        event.preventDefault()
        const values = [...regex];
        values.push('');
        setRegex(values);
    };

    const styles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'green',
        // height: '100vh',
    };

    const partialStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'gold',
    };

    const centerButton = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    }

    const centerButton380 = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '380px',
    }

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
        if (regexErrorText !== '') {
            setRegexErrorText('')
            while (i < regex.length) {
                if (regex[i] === '') {
                    setRegexErrorText("* No entries may be left blank *")
                    return;
                }
                i++;
            }
        }
    };

    const prettifyJSON = (str) => {
        try {
            const json = JSON.parse(str);
            const prettified = JSON.stringify(json, null, 2);
            setJsonStr(prettified)
        } catch (error) {
            console.error(error)
        }
    }

    const handleCloseJsonModal = () => {
        // prettifyJSON();
        setJsonBool(false);
    }

    const handleExpandAllGatling = () => {
        if (textExpand[1] === false) {
            let rn = textExpand
            rn[1] = true;
            setTextExpand(rn)
            handleGatlingLists()
        }

        let expanded = expandAllList
        expanded[1] = !expanded[1]
        setExpandAllList(expanded)
        let current = [...gatlingCollapse]
        current.fill(expanded[1])

        let currentStatus = [...expandStatusList]

        if (currentStatus[1].toString() === "Expand All") {
            currentStatus[1] = "Collapse All"
        } else {
            currentStatus[1] = "Expand All"
        }
        setExpandStatusList(currentStatus)

        setGatlingCollapse(current)
    }

    const handleExpandAllSelenium = () => {
        if (textExpand[2] === false) {
            let rn = textExpand
            rn[2] = true;
            setTextExpand(rn)
            handleSeleniumLists()
        }

        let expanded = expandAllList
        expanded[2] = !expanded[2]
        setExpandAllList(expanded)
        let current = [...seleniumCollapse]
        current.fill(expanded[2])

        let currentStatus = [...expandStatusList]

        if (currentStatus[2].toString() === "Expand All") {
            currentStatus[2] = "Collapse All"
        } else {
            currentStatus[2] = "Expand All"
        }
        setExpandStatusList(currentStatus)

        setSeleniumCollapse(current)
    }

    const handleExpandAllSwagger = () => {
        if (textExpand[0] === false) {
            let rn = textExpand
            rn[0] = true;
            setTextExpand(rn)
            handleSwaggerLists()
        }

        let expanded = expandAllList
        expanded[0] = !expanded[0]
        setExpandAllList(expanded)
        let current = [...swaggerCollapse]
        current.fill(expanded[0])

        let currentStatus = [...expandStatusList]

        if (currentStatus[0].toString() === "Expand All") {
            currentStatus[0] = "Collapse All"
        } else {
            currentStatus[0] = "Expand All"
        }
        setExpandStatusList(currentStatus)

        setSwaggerCollapse(current)
    }

    const handleCollapseGatling = (index) => {
        if (textExpand[1] === false) {
            // setTextExpand(true)
            let rn = textExpand
            rn[1] = true;
            setTextExpand(rn);
            handleGatlingLists()
        }

        let current = [...gatlingCollapse]
        let update = current[index]
        current[index] = !update

        setGatlingCollapse(current)
    }

    const handleCollapseSelenium = (index) => {
        if (textExpand[2] === false) {
            let rn = textExpand
            rn[2] = true;
            setTextExpand(rn)
            handleSeleniumLists()
        }

        let current = [...seleniumCollapse]
        let update = current[index]
        current[index] = !update

        setSeleniumCollapse(current)
    }

    const handleCollapseSwagger = (index) => {
        if (textExpand[0] === false) {
            let rn = textExpand
            rn[0] = true;
            setTextExpand(rn)
            handleSwaggerLists()
        }

        let current = [...swaggerCollapse]
        let update = current[index]
        current[index] = !update

        setSwaggerCollapse(current)
    }


    const handleGatlingLists = () => {
        let counter = 0
        let arr = Array(Object.keys(swaggerMap).length * 2).fill('')
        let pct = Array(Object.keys(swaggerMap).length).fill(0.0)

        for (const [key, value] of Object.entries(swaggerMap)) {
            if (key !== '') {
                let localTested = ''
                let testNum = 0
                let localNot = ''
                let notNum = 0

                for (const currentVal of value) {
                    if (fullGatling.includes(currentVal)) {
                        localTested = localTested + currentVal + '\n'
                        testNum += 1
                    } else {
                        localNot = localNot + currentVal + '\n'
                        notNum += 1
                    }
                }
                arr[counter] = localTested
                arr[counter + 1] = localNot
                pct[counter / 2] = (testNum * 100) / (testNum + notNum)
                counter += 2
            }
        }

        setGatlingSplit(arr)
        setGatlingPct(pct)
    }

    const handleSeleniumLists = () => {
        let counter = 0
        let arr = Array(Object.keys(swaggerMap).length * 2).fill('')
        let pct = Array(Object.keys(swaggerMap).length).fill(0.0)

        for (const [key, value] of Object.entries(swaggerMap)) {
            if (key !== '') {
                let localTested = ''
                let testNum = 0
                let localNot = ''
                let notNum = 0

                for (const currentVal of value) {
                    if (fullSelenium.includes(currentVal)) {
                        localTested = localTested + currentVal + '\n'
                        testNum += 1
                    } else {
                        localNot = localNot + currentVal + '\n'
                        notNum += 1
                    }
                }
                arr[counter] = localTested
                arr[counter + 1] = localNot
                pct[counter / 2] = (testNum * 100) / (testNum + notNum)
                counter += 2
            }
        }

        setSeleniumSplit(arr)
        setSeleniumPct(pct)
    }

    const handleSwaggerLists = () => {
        let counter = 0
        let arr = Array(Object.keys(swaggerMap).length * 3).fill('')
        let pct = Array(Object.keys(swaggerMap).length * 2).fill(0.0)

        for (const [key, value] of Object.entries(swaggerMap)) {
            if (key !== '') {
                let localFullTested = ''
                let fullNum = 0
                let localPartialTested = ''
                let partialNum = 0
                let localNot = ''
                let notNum = 0

                for (const currentVal of value) {
                    if (fullSwagger.includes(currentVal)) {
                        localFullTested = localFullTested + currentVal + '\n'
                        fullNum += 1
                    } else if (partialSwagger.includes(currentVal)) {
                        localPartialTested = localPartialTested + currentVal + '\n'
                        partialNum += 1
                    } else {
                        localNot = localNot + currentVal + '\n'
                        notNum += 1
                    }
                }
                arr[counter] = localFullTested
                arr[counter + 1] = localPartialTested
                arr[counter + 2] = localNot
                pct[(counter / 3) * 2] = (fullNum * 100) / (partialNum + fullNum + notNum)
                pct[(counter / 3) * 2 + 1] = (partialNum * 100) / (partialNum + fullNum + notNum)
                counter += 3
            }
        }

        setSwaggerSplit(arr)
        setSwaggerPct(pct)
    }

    const sendFiles = async() => {
        //send file to backend to get the results
        const projectFormData = new FormData();
        projectFormData.append('file', projectZip);

        const testFormData = new FormData();
        testFormData.append('file', testZip);

        const selFormData = new FormData();
        selFormData.append('file', selZip);

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

        await axios.post("http://localhost:8080/requests/logs/methodField", {field: methodField})
            .then((response) => {
            console.log(response);
        });

        await axios.post("http://localhost:8080/requests/logs/urlField", {field: urlField})
            .then((response) => {
            console.log(response);
        });

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
            setPartialSwagger(responseString);
        }).catch((err) => console.error(err))

        // await axios.get("http://localhost:8080/tests/coverage/getNoSwagger")
        //     .then((res) => {
        //         console.log(res.data)
        //         //setResults(res.data)
        //         const responseString = res.data.reduce((acc, obj) => {
        //             return acc + `${obj}\n`
        //         }, '')
        //         setNoSwagger(responseString);
        //     }).catch((err) => console.error(err))

        await axios.get("http://localhost:8080/tests/coverage/getFullGatling")
            .then((res) => {
                console.log(res.data)
                //setResults(res.data)
                const responseString = res.data.reduce((acc, obj) => {
                    return acc + `${obj}\n`
                }, '')
                setFullGatling(responseString);
            }).catch((err) => console.error(err))

        // await axios.get("http://localhost:8080/tests/coverage/getNoGatling")
        //     .then((res) => {
        //         console.log(res.data)
        //         //setResults(res.data)
        //         const responseString = res.data.reduce((acc, obj) => {
        //             return acc + `${obj}\n`
        //         }, '')
        //         setNoGatling(responseString);
        //     }).catch((err) => console.error(err))

        await axios.get("http://localhost:8080/tests/coverage/getFullSelenium")
            .then((res) => {
                console.log(res.data)
                //setResults(res.data)
                const responseString = res.data.reduce((acc, obj) => {
                    return acc + `${obj}\n`
                }, '')
                setFullSelenium(responseString);
            }).catch((err) => console.error(err))

        // await axios.get("http://localhost:8080/tests/coverage/getNoSelenium")
        //     .then((res) => {
        //         console.log(res.data)
        //         //setResults(res.data)
        //         const responseString = res.data.reduce((acc, obj) => {
        //             return acc + `${obj}\n`
        //         }, '')
        //         setNoSelenium(responseString);
        //     }).catch((err) => console.error(err))

        // await axios.get("http://localhost:8080/tests/coverage/getTestMap")
        //     .then((res) => {
        //         console.log(res.data)
        //
        //         setTestMap(res.data);
        //
        //         /** Good */
        //         setKeyList(Object.keys(res.data));
        //         setTestMapString("test2");
        //         setCollapseList(Array(Object.keys(res.data).length).fill(false))
        //
        //
        //         Object.keys(res.data).map((current) => {
        //             return (
        //                 setValueList([...valueList, res.data[current]])
        //             );
        //         })
        //
        //     }).catch((err) => console.error(err))

        await axios.post("http://localhost:8080/requests/logs/endpoints", selFormData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        }).then((res) => {
            console.log(res.data)
            //JSON.parse(res.data).forEach(element => console.log(element.method))
            // const responseString = res.data.reduce((acc, obj) => {
            //     return acc + `${obj.method} ${obj.path}\n`
            // }, '')
            // setProjectRes(responseString)
        }).catch((err) => console.error(err))

        await axios.get("http://localhost:8080/tests/coverage/getSwaggerMap")
            .then((res) => {
                console.log(res.data)

                setSwaggerMap(res.data)

                setSwaggerCollapse(Array(Object.keys(res.data).length).fill(false))
                setGatlingCollapse(Array(Object.keys(res.data).length).fill(false))
                setSeleniumCollapse(Array(Object.keys(res.data).length).fill(false))
            }).catch((err) => console.error(err))

        await axios.get("http://localhost:8080/tests/coverage/getJsonCoverage")
            .then((res) => {
                console.log(res.data)
                prettifyJSON(res.data + '}')
            }).catch((err) => console.error(err))

        handleShow()

        handleShow()

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
            
            <p>Upload Gatling tests.zip</p>
            <input 
            type="file" 
            onChange={handleTestZipChange} 
            accept=".zip"/>
            <div>{testZip && `${testZip.name} - ${testZip.type}`}</div>

            <br/>
            <br/>

            <p>Upload Selenium tests.zip</p>
            <input
                type="file"
                onChange={handleSelZipChange}
                accept=".zip"/>
            <div>{selZip && `${selZip.name} - ${selZip.type}`}</div>
            
            <br/>

            <Button variant={theme === 'light' ? "primary" : "dark"} onClick={handleUploadClick}>Upload</Button>
            <ClipLoader
                color={"blue"}
                loading={loading}
                size={18}
                aria-label="Loading Spinner"
                data-testid="loader"
            />

            <br/>
            {showPieChart ?
                <div>
                    <br/>
                    <Button variant="secondary" onClick={() => setJsonBool(true)}>{jsonButton}</Button>
                </div>
                : null}


            <br/>

            <Container fluid>
                <Row>
                    <Col>
                        { showPieChart ?
                            <div key={projectKey} style={max380}>
                                <h3>Total Coverage</h3>
                                <PieChartComponent />
                                <div style={alignCenter}>
                                    <Button style={centerButton} variant="primary" onClick={() => handleExpandAllSwagger()}>{expandStatusList[0]}</Button>
                                </div>
                                {Object.entries(swaggerMap).map(([key,value], index)=>{
                                    return (
                                        <div>
                                            <br/>
                                            <Button style={centerButton380} variant="outline-dark" onClick={() => handleCollapseSwagger(index)}>{key}</Button>
                                            {swaggerCollapse.at(index) ?
                                                <div>
                                                    {/*<div>{index}</div>*/}
                                                    {/*<div>{testingLength}</div>*/}
                                                    <div style={styles}>{swaggerPct[index * 2].toFixed(2)}% Total Coverage</div>
                                                    <div style={partialStyles}>{swaggerPct[index * 2 + 1].toFixed(2)}% Partial Coverage</div>
                                                    <div style={max380}>
                                                        <textarea style={{color: "green"}} cols="43" readOnly="true" rows={swaggerSplit[index * 3].split(/\r\n|\r|\n/).length - 1 | 2}>{swaggerSplit[index * 3]}</textarea>
                                                    </div>
                                                    <div style={max380}>
                                                        <textarea style={{color: "gold"}} cols="43" readOnly="true" rows={swaggerSplit[index * 3 + 1].split(/\r\n|\r|\n/).length - 1 | 2}>{swaggerSplit[index * 3 + 1]}</textarea>
                                                    </div>
                                                    <div style={max380}>
                                                        <textarea style={{color: "red"}} cols="43" readOnly="true" rows={swaggerSplit[index * 3 + 2].split(/\r\n|\r|\n/).length - 1 | 2}>{swaggerSplit[index * 3 + 2]}</textarea>
                                                    </div>
                                                </div>
                                                : null}
                                        </div>
                                    );
                                })
                                }
                            </div>
                            : null}
                    </Col>
                    <Col>
                        {showPieChart ?
                        <div key={projectKey} style={max380}>
                                <h3>Gatling</h3>
                                <GatlingPieChart />

                            <div style={{textAlign: "center"}}>
                                <Button style={centerButton} variant="primary" onClick={() => handleExpandAllGatling()}>{expandStatusList[1]}</Button>
                            </div>
                            {Object.entries(swaggerMap).map(([key,value], index)=>{
                                return (
                                    <div>
                                        <br/>
                                        <Button style={centerButton380} variant="outline-dark" onClick={() => handleCollapseGatling(index)}>{key}</Button>
                                        {gatlingCollapse.at(index) ?
                                            <div>
                                                <div style={styles}>{gatlingPct[index].toFixed(2)}% Coverage</div>
                                                <div style={max380}>
                                                    <textarea style={{color: "green"}} cols="43" readOnly="true" rows={gatlingSplit[index * 2].split(/\r\n|\r|\n/).length - 1 | 2}>{gatlingSplit[index * 2]}</textarea>
                                                </div>
                                                <div style={max380}>
                                                    <textarea style={{color: "red"}} cols="43" readOnly="true" rows={gatlingSplit[index * 2 + 1].split(/\r\n|\r|\n/).length - 1 | 2}>{gatlingSplit[index * 2 + 1]}</textarea>
                                                </div>
                                            </div>
                                        : null}
                                    </div>
                                );
                            })
                            }

                        </div>
                            : null}
                    </Col>
                    <Col>
                        { showPieChart ?
                        <div key={projectKey} style={max380}>
                            <h3>Selenium</h3>
                            <SeleniumPieChart />
                            <div style={{textAlign: "center"}}>
                                <Button style={centerButton} variant="primary" onClick={() => handleExpandAllSelenium()}>{expandStatusList[2]}</Button>
                            </div>
                            {Object.entries(swaggerMap).map(([key,value], index)=>{
                                return (
                                    <div>
                                        <br/>
                                        <Button style={centerButton380} variant="outline-dark" onClick={() => handleCollapseSelenium(index)}>{key}</Button>
                                        {seleniumCollapse.at(index) ?

                                            <div>
                                                <div style={styles}>{seleniumPct[index].toFixed(2)}% Coverage</div>
                                                <div style={max380}>
                                                    <textarea style={{color: "green"}} cols="43" readOnly="true" rows={seleniumSplit[index * 2].split(/\r\n|\r|\n/).length - 1 | 2}>{seleniumSplit[index * 2]}</textarea>
                                                </div>
                                                <div style={max380}>
                                                    <textarea style={{color: "red"}} cols="43" readOnly="true" rows={seleniumSplit[index * 2 + 1].split(/\r\n|\r|\n/).length - 1 | 2}>{seleniumSplit[index * 2 + 1]}</textarea>
                                                </div>
                                            </div>
                                            : null}
                                    </div>
                                );
                            })
                            }
                        </div>
                            : null}
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
                            {methodFieldPrompt}
                            <input value={methodField} onChange={handleMethodFieldChange}/>
                        </label>
                    </form>
                    <br />
                    <form>
                        <label>
                            {urlFieldPrompt}
                            <input value={urlField} onChange={handleUrlFieldChange}/>
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
                            </div>
                        ))}
                        <h8 style={{ color: 'red' }}>{regexErrorText}</h8>
                    </form>

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

            <Modal show={jsonBool} onHide={handleCloseJsonModal}>
                <Modal.Header>
                    <Modal.Title>JSON Formatted Coverage</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <textarea readOnly="true" cols="50" rows="100">{jsonStr}</textarea>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseJsonModal}>
                        Ok
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
