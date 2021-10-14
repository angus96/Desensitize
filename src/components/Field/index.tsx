import React, {ReactElement} from 'react';
import './index.less'

interface FieldProps {
    label?: string;
    children?: ReactElement;
}
const Field = (props: FieldProps) => {
    return (
        <div className="field">
            <div className="field__label">{props.label}</div>
            <div className="field__content">
                {
                    props.children
                }
            </div>
        </div>
    )
}

export default Field;