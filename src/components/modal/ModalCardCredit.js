import React from 'react'
import {Modal} from 'antd';

const ModalCardCredit = ({showModalCard, setShowModalCard, setDataStudent, loading, handlePaidEnrollment}) => {
    return (
        <>
            <Modal
                title="Pagar"
                visible={showModalCard}
                onCancel={() => setShowModalCard(!showModalCard)}
                width={720}
                footer={null}
            >
                <div className="body-custom">
                    <div className="payment-custom">
                        <div className="bg-custom"></div>

                        <div className="card-custom">
                            <img src="/chip.png" className="chip-custom" alt="chip" />
                            <div className="logo-custom"></div>
                            <div className="inputBox-custom">
                                    <input 
                                        className="bankName-custom" 
                                        type="text" 
                                        placeholder="Nombre del banco" 
                                        maxLength="19" 
                                        name="bankName"
                                        onChange={e => setDataStudent(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                    />
                                </div>
                            <form className="form-card-custom">
                                <div className="inputBox-custom">
                                    <span>Nº de Tarjeta</span>
                                    <input 
                                        type="text" 
                                        placeholder="0123 4567 8901 2345" 
                                        maxLength="19" 
                                        name="number"
                                        onChange={e => setDataStudent(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                    />
                                </div>
                                <div className="inputBox-custom">
                                    <span>Titular</span>
                                    <input 
                                        type="text" 
                                        placeholder="Leonardo Noriega" 
                                        name="nameTarget"
                                        onChange={e => setDataStudent(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                    />
                                </div>
                                <div className="group-custom">
                                    <div className="inputBox-custom">
                                        <span>Valido Hasta</span>
                                        <input 
                                            type="text" 
                                            placeholder="MM/YY" 
                                            maxLength="5"
                                            name="validDate"
                                            onChange={e => setDataStudent(prev => ({ ...prev, [e.target.name]: e.target.value }))} 
                                    />
                                    </div>
                                    <div className="inputBox-custom">
                                        <span>CCV</span>
                                        <input 
                                            type="password" 
                                            placeholder="***" 
                                            maxLength="4" 
                                            name="ccv"
                                            onChange={e => setDataStudent(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <button className="btn-custom" onClick={handlePaidEnrollment}>{loading ? "Procesando..." : "Confirmar"}</button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ModalCardCredit
