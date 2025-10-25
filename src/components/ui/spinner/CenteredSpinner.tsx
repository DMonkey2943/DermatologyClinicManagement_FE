import { Spinner } from "@/components/ui/spinner";

export default function CenteredSpinner() {
    return (
        <div className="flex justify-center py-4">
            <Spinner className="h-8 w-8" /> {/* Adjust size as needed */}
        </div>
    );
}