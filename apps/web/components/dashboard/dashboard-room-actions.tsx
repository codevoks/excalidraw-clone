"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "../ui";
import api from "../../apiService/client";
import { slugifyRoomName } from "../../lib/roomSlug";
import { useNavigate } from "../../hooks/useNavigate";

type Panel = "new" | "join" | null;

export function DashboardRoomActions() {
  const navigate = useNavigate();
  const [panel, setPanel] = useState<Panel>(null);
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const slugPreview = slugifyRoomName(roomName);
  const canSubmit = slugPreview.length > 0;

  const closePanel = () => {
    setPanel(null);
    setRoomName("");
    setError(null);
  };

  const goToDraw = (slug: string) => {
    navigate(`/draw?room=${encodeURIComponent(slug)}`);
  };

  const handleCreate = async () => {
    setError(null);
    if (!canSubmit) {
      setError("Enter a room name with letters or numbers.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/v1/rooms", { name: roomName });
      goToDraw(slugPreview);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg =
          (err.response?.data as { message?: string } | undefined)?.message ??
          err.message;
        setError(typeof msg === "string" ? msg : "Could not create room.");
      } else {
        setError("Could not create room.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setError(null);
    if (!canSubmit) {
      setError("Enter a room name with letters or numbers.");
      return;
    }
    setLoading(true);
    try {
      await api.get(`/v1/rooms/${encodeURIComponent(slugPreview)}`);
      goToDraw(slugPreview);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError("No room with that name. Check the name or create a new room.");
      } else if (axios.isAxiosError(err)) {
        const msg =
          (err.response?.data as { message?: string } | undefined)?.message ??
          err.message;
        setError(typeof msg === "string" ? msg : "Could not join room.");
      } else {
        setError("Could not join room.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-end">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          onClick={() => {
            setPanel("new");
            setRoomName("");
            setError(null);
          }}
        >
          New room
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setPanel("join");
            setRoomName("");
            setError(null);
          }}
        >
          Join room
        </Button>
      </div>

      {panel !== null && (
        <div
          className="w-full min-w-[min(100%,18rem)] max-w-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated,var(--color-surface))] p-4 shadow-sm sm:w-80"
          role="dialog"
          aria-labelledby="room-panel-title"
        >
          <div className="mb-3 flex items-start justify-between gap-2">
            <h2
              id="room-panel-title"
              className="text-sm font-semibold text-[var(--color-foreground)]"
            >
              {panel === "new" ? "Create a room" : "Join a room"}
            </h2>
            <button
              type="button"
              className="rounded-md px-2 py-1 text-xs text-[var(--color-foreground-muted)] hover:bg-[var(--color-border)]/30"
              onClick={closePanel}
            >
              Close
            </button>
          </div>
          <label className="block text-xs font-medium text-[var(--color-foreground-muted)]">
            Room name
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g. design-sync"
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none focus:border-[var(--color-secondary)]"
              autoComplete="off"
              disabled={loading}
            />
          </label>
          {slugPreview ? (
            <p className="mt-2 text-xs text-[var(--color-foreground-muted)]">
              Opens as:{" "}
              <span className="font-mono text-[var(--color-secondary)]">
                /draw?room={slugPreview}
              </span>
            </p>
          ) : null}
          {error ? (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="tertiary" onClick={closePanel} disabled={loading}>
              Cancel
            </Button>
            {panel === "new" ? (
              <Button
                variant="primary"
                onClick={handleCreate}
                disabled={!canSubmit || loading}
              >
                {loading ? "Creating…" : "Create"}
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleJoin}
                disabled={!canSubmit || loading}
              >
                {loading ? "Joining…" : "Join"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
