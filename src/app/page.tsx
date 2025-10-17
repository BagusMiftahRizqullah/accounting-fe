import ReportHeader from "@/components/ReportHeader";
import ExpenseItem from "@/components/ExpenseItem";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <ReportHeader />
        <ExpenseItem />
      </div>
    </div>
  );
}