import React from 'react'
import { connect } from 'react-redux'

export const CareDetailsPage = (props) => {
    return (
        <div className="add-new-main-container">
            <Container>
                <Col md="12" lg="12">
                    <Row>
                        <p className="tab-title font14">{tabName}</p>
                    </Row>
                    <div className="delight-bottom">
                        <div className="build-box build-box-admin">



                        </div>

                    </div>


                </Col>
            </Container>
            </div>
    )
}

const mapStateToProps = (state) => ({

            })

const mapDispatchToProps = {

            }

export default connect(mapStateToProps, mapDispatchToProps)(CareDetailsPage)
