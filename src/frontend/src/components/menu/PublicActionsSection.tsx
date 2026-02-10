import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, MapPin } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

// These would ideally come from backend config
const PHONE_NUMBER = '+91-1234567890';
const WHATSAPP_NUMBER = '911234567890';
const LOCATION_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.2!2d77.2!3d28.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzAwLjAiTiA3N8KwMTInMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890';

export default function PublicActionsSection() {
  const handleCall = () => {
    window.location.href = `tel:${PHONE_NUMBER}`;
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hi! I would like to place an order from your menu.');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <section className="py-8 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <Button onClick={handleCall} className="w-full" size="lg">
              <Phone className="mr-2 h-5 w-5" />
              Call to Order
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <Button onClick={handleWhatsApp} className="w-full bg-[#25D366] hover:bg-[#20BA5A]" size="lg">
              <SiWhatsapp className="mr-2 h-5 w-5" />
              Order on WhatsApp
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Find Us</h3>
          </div>
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <iframe
              src={LOCATION_EMBED}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Restaurant Location"
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
