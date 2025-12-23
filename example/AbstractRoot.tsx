import React from 'react';

const GrandParent = ({ children }) => (<module name="GrandParent">{ children }</module>);
const ParentOne = ({ children }) => (<module name="ParentOne">{ children }</module>);
const ParentTwo = ({ children }) => (<module name="ParentTwo">{ children }</module>);
const ChildOne = () => (<module name="ChildOne" />);
const ChildTwo = () => (<module name="ChildTwo" />);

export const AbstractRoot = () => {
    const [status] = React.useState('ONE');
    return (
        <GrandParent>
            { status === 'ONE' && (
                <ParentOne>
                    <ChildOne />
                </ParentOne>
            )}
            { status === 'TWO' && (
                <ParentTwo>
                    <ChildTwo />
                </ParentTwo>
            )}
        </GrandParent>
    );
};
