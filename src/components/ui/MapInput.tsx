"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, MapPin, Loader2, Navigation, CheckCircle2 } from "lucide-react";
import { Input } from "./Forms";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { devLog, devError } from "@/lib/logger";

// Fix Leaflet default icon issues in Next.js
if (typeof window !== "undefined") {
  const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  L.Marker.prototype.options.icon = DefaultIcon;
}


interface MapInputProps {
  onLocationChange: (lat: number, lng: number) => void;
  initialLocation?: [number, number];
  label?: string;
  compact?: boolean;
}

function LocationMarker({ 
  position, 
  setPosition 
}: { 
  position: [number, number] | null, 
  setPosition: (pos: [number, number]) => void 
}) {
  const map = useMapEvents({
    click(e) {
      const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export const MapInput = ({ onLocationChange, initialLocation, label, compact = false }: MapInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(initialLocation || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Removed useEffect that was causing infinite loops

  const updatePosition = (newPos: [number, number]) => {
    setPosition(newPos);
    onLocationChange(newPos[0], newPos[1]);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPos: [number, number] = [parseFloat(lat), parseFloat(lon)];
        updatePosition(newPos);
      }
    } catch (err) {
      devError("Geocoding failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  if (!mounted) {
    return (
      <div className="h-10 w-full bg-surface/50 border border-border rounded-xl flex items-center justify-center animate-pulse">
        <Loader2 className="animate-spin text-primary size-3" />
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {label && <label className="text-[9px] font-black text-textMuted uppercase tracking-[0.15em] ml-1">{label}</label>}
      
      <div className="flex items-center gap-2">
        <Button 
          type="button"
          variant={position ? "secondary" : "primary"}
          onClick={() => setIsOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all group"
        >
          {position ? (
            <>
              <CheckCircle2 size={14} className="text-success" />
              Pinned
            </>
          ) : (
            <>
              <Navigation size={14} className="group-hover:translate-x-0.5 transition-transform" />
              Pin Location
            </>
          )}
        </Button>

        {position && (
          <div className="flex gap-1.5">
            <div className="px-2.5 py-1.5 bg-surface/50 border border-border/50 rounded-lg text-center min-w-[70px]">
              <p className="text-[7px] font-black text-textMuted uppercase leading-none mb-0.5">Lat</p>
              <p className="text-[9px] font-bold text-text tabular-nums">{position[0].toFixed(3)}</p>
            </div>
            <div className="px-2.5 py-1.5 bg-surface/50 border border-border/50 rounded-lg text-center min-w-[70px]">
              <p className="text-[7px] font-black text-textMuted uppercase leading-none mb-0.5">Lng</p>
              <p className="text-[9px] font-bold text-text tabular-nums">{position[1].toFixed(3)}</p>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Pin Precise Location"
        className="max-w-4xl"
      >
        <div className="space-y-3 py-1">
          <div className="flex gap-2">
            <Input 
              placeholder="Search address..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 h-10 text-sm"
            />
            <Button onClick={handleSearch} disabled={isSearching} className="shrink-0 px-4 h-10">
              {isSearching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            </Button>
          </div>
          
          <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-border shadow-inner relative group z-0">
            <MapContainer 
              center={position || [24.8607, 67.0011]} 
              zoom={position ? 15 : 13} 
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker position={position} setPosition={updatePosition} />
              {position && <ChangeView center={position} />}
            </MapContainer>
            
            <div className="absolute bottom-4 left-4 z-[1000] glass px-3 py-1.5 rounded-lg border border-white/10 shadow-2xl pointer-events-none">
              <p className="text-[8px] font-black text-white uppercase tracking-widest">Guide</p>
              <p className="text-[9px] text-white/80 font-medium italic">Click map to drop pin</p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-1">
            <div className="flex gap-4">
               {position && (
                 <div className="flex gap-3 text-[10px] font-bold text-textMuted uppercase tracking-tight">
                   <span>LAT: <span className="text-text tabular-nums">{position[0].toFixed(6)}</span></span>
                   <span>LNG: <span className="text-text tabular-nums">{position[1].toFixed(6)}</span></span>
                 </div>
               )}
            </div>
            <Button onClick={() => setIsOpen(false)} variant="primary" className="px-8 h-10 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20">
              Set Coordinates
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};



