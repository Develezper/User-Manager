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
    card: "border border-indigo-200/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(224,231,255,0.98),rgba(238,242,255,0.96))]",
    avatar: "h-14 w-16 rounded-[20px] border border-indigo-200/70 bg-[linear-gradient(135deg,#3730a3,#4f46e5)] text-white shadow-[0_12px_28px_rgba(79,70,229,0.26)]",
    chip: "border border-indigo-200 bg-indigo-50 text-indigo-700",
  },
  user: {
    card: "border border-slate-200/90 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98),rgba(241,245,249,0.96))]",
    avatar: "h-14 w-16 rounded-[20px] border border-slate-200/80 bg-[linear-gradient(135deg,#334155,#64748b)] text-white shadow-[0_12px_28px_rgba(51,65,85,0.18)]",
    chip: "border border-slate-200 bg-white text-slate-700",
  },
};

export function UserCard({ nombre, cc, email, role, onEdit, onDelete, user }: UserCardProps) {
  const classes = roleClasses[role];

  return (
    <Card
      className={`${classes.card} rounded-[30px] shadow-[0_18px_46px_rgba(15,23,42,0.06)]`}
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
            className={`${classes.chip} rounded-full`}
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
          <Button className="rounded-full bg-slate-900 px-4 text-sm text-white" size="sm" onPress={() => onEdit(user)}>
            Editar
          </Button>
          <Button
            className="rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-800"
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
