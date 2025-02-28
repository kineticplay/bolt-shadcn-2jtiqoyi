import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { Facility } from '@/services/facility';

interface FacilityCardProps {
  facility: Facility;
  onDelete: (id: string) => void;
}

export function FacilityCard({ facility, onDelete }: FacilityCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-xl font-bold">{facility.name}</CardTitle>
          <CardDescription>{facility.type}</CardDescription>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <Trash className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Facility</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {facility.name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(facility.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <div className="font-semibold">Location</div>
          <div className="text-sm text-muted-foreground">{facility.location}</div>
        </div>
        {facility.description && (
          <div>
            <div className="font-semibold">Description</div>
            <div className="text-sm text-muted-foreground">{facility.description}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}