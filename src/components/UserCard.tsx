"use client";

import { Avatar, Button, Card, Chip } from "@heroui/react";
import type { User } from "@/types/user";

type UserCardProps = {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  const isAdmin = user.role === "admin";

  return (
    <Card
      className={`border ${
        isAdmin ? "border-blue-100 bg-blue-50/70" : "border-emerald-100 bg-emerald-50/70"
      } shadow-none`}
    >
      <Card.Content className="flex h-full flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className={isAdmin ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"}>
              <Avatar.Fallback>{getInitials(user.nombre)}</Avatar.Fallback>
            </Avatar>
            <div>
              <p className="eyebrow">Registro activo</p>
              <h3 className="section-title mt-1 text-lg font-semibold">{user.nombre}</h3>
            </div>
          </div>
          <Chip
            className={isAdmin ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}
            size="sm"
            variant="soft"
          >
            {user.role}
          </Chip>
        </div>

        <div className="grid gap-2 text-sm text-slate-600">
          <p>
            <span className="font-semibold text-slate-900">CC:</span> {user.cc}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Email:</span> {user.email}
          </p>
        </div>

        <div className="mt-auto flex gap-3">
          <Button className="bg-slate-900 px-4 text-sm text-white" size="sm" onPress={() => onEdit(user)}>
            Editar
          </Button>
          <Button
            className="border border-slate-200 bg-white px-4 text-sm text-slate-800"
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
