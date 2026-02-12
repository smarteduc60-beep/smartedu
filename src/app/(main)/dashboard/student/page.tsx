import StudentDashboard from "../_components/StudentDashboard";

export const dynamic = 'force-dynamic';

export default function StudentDashboardPage() {
    // We assume student ID is 1 for now
    return <StudentDashboard studentId={1} />
}
