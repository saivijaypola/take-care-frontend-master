import React from 'react';
import { Button, Modal, Card, CardText, CardBody, CardTitle } from 'reactstrap';
import useWebInstallPrompt from '../../../shared/hooks/useWebInstallPrompt';

export const InstallPWA = () => {
   
  const [webInstallPrompt, handleWebInstallDeclined, handleWebInstallAccepted] = useWebInstallPrompt();

  if ( !webInstallPrompt) {
    return null;
  }
  return (
    <Modal isOpen centered>
      <Card>
        <img
          className="mx-auto"
          style={{
            borderTopRightRadius: '50%',
            borderTopLeftRadius: '50%',
            backgroundColor: '#fff',
            marginTop: '-50px'
          }}
          width="100px"
          src="./logo512.jpg"
          alt="Icon"
        />
        <CardBody>
          <CardTitle className="text-center">
            <h3>Install App</h3>
          </CardTitle>
          
          {webInstallPrompt && (
            <div className="d-flex justify-content-around">
              <Button color="primary" onClick={handleWebInstallAccepted}>
                Install
              </Button>
              <Button onClick={handleWebInstallDeclined}>Close</Button>
            </div>
          )}
        </CardBody>
      </Card>
    </Modal>
  );
};