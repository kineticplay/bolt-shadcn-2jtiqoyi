import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { FacilityCard } from '@/components/facility/FacilityCard';
import { FacilityForm } from '@/components/facility/FacilityForm';
import { facilityService, type Facility } from '@/services/facility';

export function Settings() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchFacilities = async () => {
    try {
      setIsLoading(true);
      const response = await facilityService.getAllFacilities();
      setFacilities(response.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch facilities",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleAddFacility = async (data: Omit<Facility, 'id'>) => {
    try {
      setIsLoading(true);
      await facilityService.addFacility(data);
      await fetchFacilities();
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Facility added successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add facility",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFacility = async (id: string) => {
    try {
      await facilityService.deleteFacility(id);
      await fetchFacilities();
      toast({
        title: "Success",
        description: "Facility deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete facility",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Facility Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Facility
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Facility</DialogTitle>
            </DialogHeader>
            <FacilityForm onSubmit={handleAddFacility} isLoading={isLoading} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && facilities.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">Loading facilities...</div>
      ) : facilities.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No facilities found</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {facilities.map((facility) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              onDelete={handleDeleteFacility}
            />
          ))}
        </div>
      )}
    </div>
  );
}