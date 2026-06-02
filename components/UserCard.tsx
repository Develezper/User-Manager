"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
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
      className={`border border-black/5 ${
        isAdmin ? "bg-blue-50" : "bg-zinc-100"
      } shadow-cut rounded-[28px]`}
    >
      <CardBody className="gap-6 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-black/45">Registro activo</p>
            <h3 className="editorial-title mt-2 text-2xl font-semibold">{user.nombre}</h3>
          </div>
          <Chip
            className={`capitalize ${
              isAdmin
                ? "bg-blue-600 text-white"
                : "bg-zinc-700 text-white"
            }`}
            radius="full"
            size="sm"
            variant="solid"
          >
            {user.role}
          </Chip>
        </div>

        <div className="grid gap-3 text-sm text-black/70">
          <p>
            <span className="font-semibold text-black">CC:</span> {user.cc}
          </p>
          <p>
            <span className="font-semibold text-black">Email:</span> {user.email}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            className="bg-black text-white"
            radius="full"
            size="sm"
            onPress={() => onEdit(user)}
          >
            Editar
          </Button>
          <Button
            className="border border-black/10 bg-white text-black"
            radius="full"
            size="sm"
            variant="flat"
            onPress={() => onDelete(user)}
          >
            Eliminar
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
