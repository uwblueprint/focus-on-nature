import React from "react";
import { ClauseInfo } from "../../../types/AdminTypes";
import WaiverSectionCard from "./WaiverSectionCard";
  
  interface WaiversTabProps {
    clauses: Array<ClauseInfo>;
  }
  const WaiversTab = ({
    clauses
  }: WaiversTabProps): JSX.Element => {

    function intToChar(number: number) {
        const code = 'A'.charCodeAt(0);  
        return String.fromCharCode(code + number);
    }
    return (
        <>
        {clauses.length && (clauses).map((clause, idx)=> {
            return <WaiverSectionCard key={idx} title={`Section ${intToChar(idx)}`}
            waiverText={clause.text}
            isRequired={clause.required}/>
        })}
        </>
    );
  };
  
  export default WaiversTab;