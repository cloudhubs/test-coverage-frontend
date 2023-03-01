import { ChangeEvent, useState } from 'react';
import axios from "axios"
import {Button, Modal, SplitButton} from 'react-bootstrap'

const FileUploadButton = (props) => {
    const theme = props.theme

    const [projectZip, setProjectZip] = useState();
    const [testZip, setTestZip] = useState();

    const [show, setShow] = useState(false)
    const [results, setResults] = useState('none')
    const [projectRes, setProjectRes] =  useState('none')

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
        sendFiles()
        handleShow()
    };

    const handleClose = () => setShow(false)

    const handleShow = () => {
        setShow(true)
    }

    const sendFiles = () => {
        //send file to backend to get the results
        const projectFormData = new FormData();
        projectFormData.append('file', projectZip);

        const testFormData = new FormData();
        testFormData.append('file', testZip);

        //send project zip
        axios.post("http://localhost:8080/tests/swagger/getEndPoints", projectFormData, {
            headers: {
                'Content-Type': 'multipart/form-data'
              },
        }).then((res) => {
            console.log(res.data)
            setProjectRes(JSON.stringify(res.data))
        }).catch((err) => console.error(err))

        /*
        //sent testZip
        axios.post("http://localhost:8080/tests/selenium/getAll", testFormData, {
            headers: {
                'Content-Type': 'multipart/form-data'
              },
        }).then((res) => {
            console.log(res.data)
            setResults(res.data)
        }).catch((err) => console.error(err))

         */
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

            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Endpoints Tested</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div style={{ whiteSpace: 'pre'}}>
                    {results}
                  </div>
                    <div style={{ whiteSpace: 'pre'}}>
                        {projectRes}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleClose}>
                      Ok
                    </Button>
                    <div>
                    <Button variant="success" onClick={handleClose}>
                        Test
                    </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default FileUploadButton;
