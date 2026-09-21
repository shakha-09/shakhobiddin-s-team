import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ExternalLink, Navigation, MapPin } from 'lucide-react';

export interface MapMarkerItem {
  id: string;
  title: string;
  lat: number;
  lng: number;
  category?: string;
  priceLabel?: string;
  address?: string;
  coverImage?: string;
  slug?: string;
  onClick?: () => void;
}

interface LeafletMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: MapMarkerItem[];
  height?: string | number;
  className?: string;
  // Picker mode for Admin
  editable?: boolean;
  onLocationSelect?: (coords: { lat: number; lng: number }) => void;
  // Navigation links
  showExternalNav?: boolean;
}

const createPinIcon = (color: string = '#E11D48', isEditable: boolean = false) => {
  return L.divIcon({
    className: 'leaflet-custom-div-pin',
    html: `
      <div style="transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center; cursor: ${isEditable ? 'grab' : 'pointer'};">
        <div style="background-color: ${color}; width: 38px; height: 38px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.35); border: 2.5px solid #ffffff; transition: transform 0.2s;">
          <svg style="transform: rotate(45deg); width: 18px; height: 18px; color: white;" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
        <div style="width: 12px; height: 5px; background: rgba(0,0,0,0.3); border-radius: 50%; margin-top: 3px; filter: blur(1px);"></div>
      </div>
    `,
    iconSize: [38, 46],
    iconAnchor: [19, 46],
    popupAnchor: [0, -46],
  });
};

export const LeafletMap: React.FC<LeafletMapProps> = ({
  center = { lat: 41.2995, lng: 69.2401 },
  zoom = 14,
  markers = [],
  height = '380px',
  className = '',
  editable = false,
  onLocationSelect,
  showExternalNav = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const editableMarkerRef = useRef<L.Marker | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up existing map instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [center.lat, center.lng],
      zoom: zoom,
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const markerGroup = L.layerGroup().addTo(map);
    markerGroupRef.current = markerGroup;
    mapInstanceRef.current = map;

    // Resize observer to ensure tiles render seamlessly in modals and cards
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    // Initial timeout trigger for smooth rendering
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center and zoom when center prop changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!editable && markers.length > 1) {
      // Multiple markers: fit bounds
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    } else {
      map.setView([center.lat, center.lng], zoom, { animate: true });
    }
  }, [center.lat, center.lng, zoom, markers.length, editable]);

  // Handle markers & editable mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    if (editable) {
      // Editable picker pin
      const icon = createPinIcon('#E11D48', true);
      const marker = L.marker([center.lat, center.lng], {
        icon,
        draggable: true
      });

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; text-align: center; padding: 4px;">
          <strong style="color: #111827; display: block; margin-bottom: 2px;">Joylashuv belgisi</strong>
          <span style="color: #4B5563;">Xaritani bosing yoki belgini kerakli manzilga torting</span>
        </div>
      `);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        if (onLocationSelect) {
          onLocationSelect({
            lat: Number(pos.lat.toFixed(6)),
            lng: Number(pos.lng.toFixed(6))
          });
        }
      });

      marker.addTo(group);
      editableMarkerRef.current = marker;

      const handleMapClick = (e: L.LeafletMouseEvent) => {
        const newCoords = {
          lat: Number(e.latlng.lat.toFixed(6)),
          lng: Number(e.latlng.lng.toFixed(6))
        };
        marker.setLatLng([newCoords.lat, newCoords.lng]);
        map.panTo([newCoords.lat, newCoords.lng]);
        if (onLocationSelect) {
          onLocationSelect(newCoords);
        }
      };

      map.on('click', handleMapClick);

      return () => {
        map.off('click', handleMapClick);
      };
    } else {
      // Render passed markers
      const itemsToRender = markers.length > 0 ? markers : [
        {
          id: 'center-pin',
          title: 'Joylashuv',
          lat: center.lat,
          lng: center.lng
        }
      ];

      itemsToRender.forEach((m) => {
        const icon = createPinIcon('#E11D48', false);
        const marker = L.marker([m.lat, m.lng], { icon });

        const popupContent = `
          <div style="min-width: 200px; max-width: 260px; font-family: sans-serif; padding: 2px;">
            ${m.coverImage ? `
              <div style="width: 100%; height: 110px; border-radius: 8px; overflow: hidden; margin-bottom: 8px; background: #e5e7eb;">
                <img src="${m.coverImage}" alt="${m.title}" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
            ` : ''}
            <div style="font-weight: 700; font-size: 14px; color: #111827; margin-bottom: 4px;">
              ${m.title}
            </div>
            ${m.address ? `
              <div style="font-size: 11px; color: #4B5563; margin-bottom: 6px; line-height: 1.3;">
                📍 ${m.address}
              </div>
            ` : ''}
            ${m.priceLabel ? `
              <div style="font-size: 12px; font-weight: 700; color: #E11D48; margin-bottom: 8px;">
                ${m.priceLabel}
              </div>
            ` : ''}
            <div style="display: flex; gap: 6px; margin-top: 6px;">
              <a href="https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; justify-content: center; gap: 4px; padding: 5px 8px; background-color: #f3f4f6; border-radius: 6px; font-size: 11px; font-weight: 600; color: #374151; text-decoration: none; flex: 1;">
                Google Maps ↗
              </a>
              <a href="https://yandex.com/maps/?rtext=~${m.lat},${m.lng}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; justify-content: center; gap: 4px; padding: 5px 8px; background-color: #fef2f2; border-radius: 6px; font-size: 11px; font-weight: 600; color: #dc2626; text-decoration: none; flex: 1;">
                Yandex ↗
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        if (m.onClick) {
          marker.on('click', () => {
            m.onClick?.();
          });
        }

        marker.addTo(group);
      });
    }
  }, [center.lat, center.lng, editable, markers, onLocationSelect]);

  const targetLat = editable ? center.lat : (markers[0]?.lat || center.lat);
  const targetLng = editable ? center.lng : (markers[0]?.lng || center.lng);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-gray-200 shadow-xs bg-gray-100 ${className}`}>
      {/* Map Container */}
      <div
        ref={mapContainerRef}
        style={{ height, width: '100%', zIndex: 1 }}
        className="w-full relative"
      />

      {/* External Navigation Bar & Coordinates Badge */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto rounded-xl bg-white/95 backdrop-blur-md px-3 py-1.5 text-[11px] font-semibold text-gray-700 shadow-md border border-gray-200 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-rose-600" />
          <span>{targetLat.toFixed(4)}, {targetLng.toFixed(4)}</span>
          {editable && <span className="text-rose-600 font-bold ml-1">(Tanlash uchun bosing)</span>}
        </div>

        {showExternalNav && !editable && (
          <div className="pointer-events-auto flex items-center gap-1.5">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${targetLat},${targetLng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-white/95 backdrop-blur-md px-3 py-1.5 text-[11px] font-bold text-gray-800 shadow-md border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              <Navigation className="w-3 h-3 text-blue-600" />
              <span>Google Maps</span>
              <ExternalLink className="w-2.5 h-2.5 text-gray-400 ml-0.5" />
            </a>
            <a
              href={`https://yandex.com/maps/?rtext=~${targetLat},${targetLng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-white/95 backdrop-blur-md px-3 py-1.5 text-[11px] font-bold text-gray-800 shadow-md border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              <span className="text-red-600 font-extrabold text-[10px]">Я</span>
              <span>Yandex Maps</span>
              <ExternalLink className="w-2.5 h-2.5 text-gray-400 ml-0.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
