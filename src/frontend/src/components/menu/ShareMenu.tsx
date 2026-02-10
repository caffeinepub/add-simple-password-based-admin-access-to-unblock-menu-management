import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { getQRCodeURL } from '../../utils/qr';
import { toast } from 'sonner';

export default function ShareMenu() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuUrl = window.location.origin + window.location.pathname;
  const qrCodeUrl = getQRCodeURL(menuUrl);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share Menu
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Menu</DialogTitle>
          <DialogDescription>Share this menu with your customers</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input value={menuUrl} readOnly className="flex-1" />
            <Button size="icon" variant="outline" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">Scan QR Code</p>
            <div className="inline-block p-4 bg-white rounded-lg">
              <img src={qrCodeUrl} alt="Menu QR Code" className="w-48 h-48" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
