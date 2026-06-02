"use client";

import { Avatar, Button, Card, Chip } from "@heroui/react";
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

const roleClasses: Record<Role, { card: string; avatar: string; chip: string }> = {
  admin: {
    card: "border border-indigo-200 bg-indigo-50/70",
    avatar: "bg-indigo-600 text-white",
    chip: "bg-indigo-100 text-indigo-700",
  },
  user: {
    card: "border border-slate-200 bg-slate-100/80",
    avatar: "bg-slate-700 text-white",
    chip: "bg-slate-200 text-slate-700",
  },
};

export function UserCard({ nombre, cc, email, role, onEdit, onDelete, user }: UserCardProps) {
  const classes = roleClasses[role];

  return (
    <Card
      className={`${classes.card} shadow-none`}
    >
      <Card.Content className="flex h-full flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className={classes.avatar}>
              <Avatar.Fallback>{getInitials(nombre)}</Avatar.Fallback>
            </Avatar>
            <div>
              <p className="eyebrow">Registro activo</p>
              <h3 className="section-title mt-1 text-lg font-semibold">{nombre}</h3>
            </div>
          </div>
          <Chip
            className={classes.chip}
            size="sm"
            variant="soft"
          >
            {role}
          </Chip>
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
          <Button className="bg-slate-900 px-4 text-sm text-white" size="sm" onPress={() => onEdit(user)}>
            ✏️ Editar
          </Button>
          <Button
            className="border border-slate-200 bg-white px-4 text-sm text-slate-800"
            size="sm"
            variant="outline"
            onPress={() => onDelete(user)}
          >
            🗑️ Eliminar
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
