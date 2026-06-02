"use client";

import { Avatar, Button, Card } from "@heroui/react";
import type { Role, User } from "@/types/user";

type UserCardProps = {
  nombre: string;
  cc: string;
  email: string;
  role: Role;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  user: User;
};

const roleClasses: Record<Role, { card: string; avatar: string; text: string }> = {
  admin: {
    card: "border border-indigo-200/80 bg-[#f7f9ff]",
    avatar: "flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border border-indigo-200/80 bg-indigo-600 text-white shadow-[0_8px_18px_rgba(79,70,229,0.18)]",
    text: "text-indigo-700",
  },
  user: {
    card: "border border-slate-200/90 bg-[#fbfcfd]",
    avatar: "flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border border-slate-200/80 bg-slate-700 text-white shadow-[0_8px_18px_rgba(51,65,85,0.14)]",
    text: "text-slate-600",
  },
};

export function UserCard({ nombre, cc, email, role, onEdit, onDelete, user }: UserCardProps) {
  const classes = roleClasses[role];

  return (
    <Card
      className={`${classes.card} rounded-[18px] shadow-[0_12px_28px_rgba(15,23,42,0.05)]`}
    >
      <Card.Content className="flex h-full flex-col gap-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className={classes.avatar}>
              <Avatar.Fallback className="flex h-full w-full items-center justify-center text-sm font-semibold leading-none">
                {getInitials(nombre)}
              </Avatar.Fallback>
            </Avatar>
            <div>
              <p className="eyebrow">Registro activo</p>
              <h3 className="section-title mt-1 text-lg font-semibold">{nombre}</h3>
            </div>
          </div>
          <span className={`text-sm font-medium ${classes.text}`}>
            {role}
          </span>
        </div>

        <div className="grid gap-2 text-sm text-slate-600">
          <p>
            <span className="font-semibold text-slate-900">CC:</span> {cc}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Email:</span> {email}
          </p>
        </div>

        <div className="mt-auto flex gap-3">
          <Button className="rounded-md bg-slate-900 px-4 text-sm text-white" size="sm" onPress={() => onEdit(user)}>
            Editar
          </Button>
          <Button
            className="rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-800"
            size="sm"
            variant="outline"
            onPress={() => onDelete(user)}
          >
            Eliminar
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
}

function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
