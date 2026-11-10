"use client";

import { useState } from "react";
import Map, { Marker } from "react-map-gl";

const parcels = [
  { id: "TZ-PARCEL-0001", coords: [39.28, -6.77], status: "Verified", owner: "0x7a2...f3e1", size: "3.2 acres" },
  { id: "TZ-PARCEL-0002", coords: [39.25, -6.80], status: "Pending", owner: "0x3b1...a9c2", size: "5.0 acres" },
  { id: "TZ-PARCEL-0003", coords: [39.30, -6.79], status: "Verified", owner: "0x9f4...d7b3", size: "2.1 acres" },
  { id: "TZ-PARCEL-0004", coords: [39.27, -6.75], status: "Pending", owner: "0x1c8...e5a4", size: "8.5 acres" },
  { id: "TZ-PARCEL-0005", coords: [39.32, -6.82], status: "Verified", owner: "0x4d2...b8f6", size: "1.7 acres" },
];

function StatusDot({ status }: { status: string }) {
  return <span className={`dot ${status === "Verified" ? "dot-emerald" : "dot-amber"}`} />;
}

export default function GisPage() {
  const [selected, setSelected] = useState<typeof parcels[0] | null>(null);
  const [viewport] = useState({ latitude: -6.77, longitude: 39.28, zoom: 11 });
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="animate-fade-in-up">
        <div className="badge badge-emerald mb-3"><span className="dot dot-emerald" /> GIS Mapping</div>
        <h1 className="text-3xl font-bold text-slate-900">Interactive Parcel Map</h1>
        <p className="mt-1 text-slate-600">Visualize land parcels, verification status, and ownership boundaries on an interactive map.</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Map */}
        <div className="card overflow-hidden">
          <div className="h-[600px]">
            {mapboxToken ? (
              <Map
                initialViewState={viewport}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/light-v11"
                mapboxAccessToken={mapboxToken}
              >
                {parcels.map((parcel) => (
                  <Marker key={parcel.id} longitude={parcel.coords[0]} latitude={parcel.coords[1]} onClick={() => setSelected(parcel)}>
                    <div className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full shadow-lg transition-transform hover:scale-125 ${parcel.status === "Verified" ? "bg-emerald-500" : "bg-amber-500"}`}>
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                  </Marker>
                ))}
              </Map>
            ) : (
              <div className="flex h-full flex-col items-center justify-center bg-slate-50 px-6 text-center">
                <h2 className="text-lg font-semibold text-slate-800">Map unavailable</h2>
                <p className="mt-2 max-w-md text-sm text-slate-600">
                  Set <code className="rounded bg-slate-200 px-1.5 py-0.5">NEXT_PUBLIC_MAPBOX_TOKEN</code> in the frontend environment and restart the app to enable the interactive map.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Legend */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-900">Map Legend</h3>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600"><span className="dot dot-emerald" /> Verified parcel</div>
              <div className="flex items-center gap-2 text-sm text-slate-600"><span className="dot dot-amber" /> Pending verification</div>
            </div>
          </div>

          {/* Selected parcel info */}
          {selected ? (
            <div className="card p-5">
              <div className="flex items-center gap-2">
                <StatusDot status={selected.status} />
                <h3 className="text-sm font-semibold text-slate-900">{selected.id}</h3>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                  <span className="text-slate-500">Status</span>
                  <span className={`badge ${selected.status === "Verified" ? "badge-emerald" : "badge-amber"}`}>{selected.status}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                  <span className="text-slate-500">Owner</span>
                  <span className="font-mono text-xs text-slate-700">{selected.owner}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                  <span className="text-slate-500">Size</span>
                  <span className="text-slate-700">{selected.size}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                  <span className="text-slate-500">Coordinates</span>
                  <span className="font-mono text-xs text-slate-700">{selected.coords[1]}, {selected.coords[0]}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-5 text-center">
              <svg className="mx-auto h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
              <p className="mt-2 text-sm text-slate-500">Click a marker to view parcel details</p>
            </div>
          )}

          {/* Parcel list */}
          <div className="card overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-3">
              <h3 className="text-sm font-semibold text-slate-900">All Parcels ({parcels.length})</h3>
            </div>
            <div className="max-h-64 divide-y divide-slate-50 overflow-y-auto">
              {parcels.map((p) => (
                <button key={p.id} onClick={() => setSelected(p)} className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-slate-50">
                  <StatusDot status={p.status} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800">{p.id}</p>
                    <p className="text-xs text-slate-500">{p.size}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
