import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Search, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export const BoothFinderPage = () => {
  const { t } = useTranslation();
  const [epicNumber, setEpicNumber] = useState('');
  const [boothData, setBoothData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!epicNumber) return;
    setIsLoading(true);
    setError('');
    setBoothData(null);
    try {
      const response = await fetch('/api/booth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ epicNumber }),
      });
      const data = await response.json();
      if (response.ok) {
        setBoothData({
          name: data.boothName,
          address: data.address,
          partNumber: data.partNumber,
          serialNumber: data.serialNumber,
          facilities: data.facilities,
          lat: data.latitude,
          lon: data.longitude,
          isDemoData: data.isDemoData
        });
      } else {
        throw new Error(data.error || 'Please enter a valid EPIC number (3 letters + 7 digits)');
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Please enter a valid EPIC number (3 letters + 7 digits)');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold text-accent mb-4 flex items-center justify-center gap-2">
          <MapPin className="w-8 h-8" />
          {t('nav_booth')}
        </h2>
        <p className="text-muted-foreground mb-6">Find your polling station using your EPIC (Voter ID) number.</p>
      </div>
      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-2">
          <div className="bg-card border border-border rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4">Search Details</h3>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">EPIC Number</label>
                <input
                  type="text"
                  placeholder="E.G. ABC1234567"
                  className="w-full px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary uppercase"
                  value={epicNumber}
                  onChange={(e) => setEpicNumber(e.target.value.toUpperCase())}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white py-2 rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? 'Searching...' : <><Search className="w-4 h-4" /> Find Booth</>}
              </button>
            </form>
          </div>
        </div>
        <div className="md:col-span-3">
          {error ? (
            <div className="h-full bg-destructive/10 border border-dashed border-destructive/20 rounded-xl flex flex-col items-center justify-center p-8 text-center text-destructive">
              <p className="font-semibold mb-2">Search Failed</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : boothData ? (
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
              <div className="bg-secondary text-white p-4">
                <h3 className="font-bold text-lg">Your Polling Station</h3>
              </div>
              <div className="p-6 flex-1 space-y-4">
                {boothData.isDemoData && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-lg text-sm">
                    This is demo data. To find your actual polling booth, please search on the official <a href="https://electoralsearch.eci.gov.in" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-amber-800 dark:hover:text-amber-300">ECI Electoral Search portal</a>.
                  </div>
                )}
                <div>
                  <h4 className="text-sm text-muted-foreground font-medium mb-1">Booth Name & Address</h4>
                  <p className="font-bold text-lg text-foreground">{boothData.name}</p>
                  <p className="text-muted-foreground">{boothData.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <h4 className="text-sm text-muted-foreground font-medium mb-1">Part Number</h4>
                    <p className="font-bold text-foreground">{boothData.partNumber}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground font-medium mb-1">Serial Number</h4>
                    <p className="font-bold text-foreground">{boothData.serialNumber}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <h4 className="text-sm text-muted-foreground font-medium mb-2">Available Facilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {boothData.facilities.map((f: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-[250px] w-full relative z-0 border-t border-border">
                <MapContainer center={[boothData.lat, boothData.lon]} zoom={14} scrollWheelZoom={false} className="h-full w-full z-0">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[boothData.lat, boothData.lon]}>
                    <Popup>{boothData.name}<br/>{boothData.address}</Popup>
                  </Marker>
                </MapContainer>
              </div>
              <div className="p-4 border-t border-border bg-muted/30">
                <button
                  onClick={() => window.open(`https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=%3B${boothData.lat}%2C${boothData.lon}`, '_blank')}
                  className="w-full text-center text-accent font-medium text-sm flex items-center justify-center gap-2 hover:underline"
                >
                  <Navigation className="w-4 h-4" /> Get Directions on OpenStreetMap
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full bg-muted/30 border border-dashed border-border rounded-xl flex items-center justify-center p-8 text-center text-muted-foreground">
              Enter your EPIC number to view your polling station details and map.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

