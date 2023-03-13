import { ChangeEvent, useState } from 'react';
import axios from "axios"
import {Button, Modal, Tab, Tabs} from 'react-bootstrap'
import ClipLoader from "react-spinners/ClipLoader";

const FileUploadButton = (props) => {
    const theme = props.theme

    const [projectZip, setProjectZip] = useState();
    const [testZip, setTestZip] = useState();

    const [show, setShow] = useState(false)
    const [results, setResults] = useState('none')
    const [projectRes, setProjectRes] =  useState('none')

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

    const handleClose = () => setShow(false)

    const handleShow = () => {
        setShow(true)
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
        setLoading(false)
        handleShow()
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
