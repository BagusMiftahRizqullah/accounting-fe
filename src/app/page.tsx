import ReportHeader from "@/components/ReportHeader";
import ExpenseItem from "@/components/ExpenseItem";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ReportHeader />

      <ExpenseItem />
    </div>
  );
}