import { useParams } from "react-router-dom";
import TransactionMaster from "../components/TransactionMaster";

export default function EditBill() {
  const { id } = useParams();
  return <TransactionMaster editMode={true} billId={id} />;
}
