import React from 'react';

import Aux from '../../../hoc/Auxiliary';
import { Button } from "reactstrap";
import CategoryServices from "../CategoryServices/CategoryServices";
import CategoryDiscount from "../DiscountsServices/CategoryDiscount";
import tooltipClasses from '../../../UI/ToolTip.css'

const Category = (props) => {
const { categoryName, categoryServices, discount } = props.category
const { id } = props


    const setModalContent = (content) => {
        props.setModal(content);
    };
    return (
        <Aux>
            <th scope='row'>
                <span className={tooltipClasses.tooltip}>...{id.slice(-2)}<span
                    className={tooltipClasses.tooltiptext}>{id}</span></span> </th>
            <td> {categoryName} </td>
            <td><Button color="dark" disabled={categoryServices.length <= 0} onClick={() => {
                setModalContent(<CategoryServices services={categoryServices}/>);
                props.modal();
            }}>services</Button>{' '}</td>
            <td>
                <Button color="dark" disabled={!discount} onClick={() => {
                    setModalContent(<CategoryDiscount discount={discount}/>);
                    props.modal();
                }}>discount
                </Button>{' '}</td>
            <td className="text-right">
                <button type="button" className="close text-right" aria-label="Close"
                        onClick={props.onDelete}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </td>
        </Aux>
    )
};


export default Category;