"use client";

import React, { useEffect } from "react";
import { Check, AlertCircle, X } from "lucide-react";
import { countSentences } from "@/config/landing-cms";
import { cn } from "@/lib/utils";
import type { TextFieldLimit } from "@/types/cms";
import type { AdminToastState } from "@/components/admin/AdminCmsProvider";

interface AdminSectionHeaderProps {
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export function AdminSectionHeader({
  title,
  description,
  actions,
}: AdminSectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
      <div>
        <h1 className="text-[26px] sm:text-[32px] font-medium tracking-[-0.03em] leading-[1.12] text-[#0c0f1d]">
          {title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-[14px] sm:text-[14.5px] font-normal leading-[1.6] text-zinc-500">
          {description}
        </p>
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

interface LimitCounterMetaProps {
  value: string;
  limit?: TextFieldLimit;
}

function LimitCounterMeta({ value, limit }: LimitCounterMetaProps) {
  if (!limit) return null;

  const chars = value.trim().length;
  const sentences = value.trim() ? countSentences(value) : 0;
  const charExceeded = chars > limit.maxChars;
  const sentenceExceeded = sentences > limit.maxSentences;
  const hasViolation = charExceeded || sentenceExceeded;

  return (
    <span
      className={cn(
        "text-[11px] font-medium tabular-nums whitespace-nowrap shrink-0 transition-colors",
        hasViolation ? "text-red-500" : "text-zinc-400"
      )}
    >
      {sentences}/{limit.maxSentences} kal · {chars}/{limit.maxChars} kar
    </span>
  );
}

const INPUT_BASE_CLASS =
  "block w-full rounded-[12px] border px-3.5 py-2.5 text-[13.5px] sm:text-[14px] text-[#0c0f1d] placeholder:text-zinc-400 focus:outline-none transition-colors";

interface BaseFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  form?: string;
  limit?: TextFieldLimit;
  helperText?: string;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

interface AdminTextFieldProps extends BaseFieldProps {
  type?: "text" | "email" | "url" | "password";
}

function hasLimitViolation(value: string, limit?: TextFieldLimit): boolean {
  if (!limit) return false;
  const trimmed = value.trim();
  return (
    trimmed.length > limit.maxChars ||
    Boolean(trimmed && countSentences(value) > limit.maxSentences)
  );
}

function getFieldInputBorderClass(isInvalid: boolean): string {
  return isInvalid
    ? "border-red-400 bg-red-50/40 focus:border-red-500 focus:bg-white"
    : "border-zinc-200/80 bg-[#f4f5f7] focus:border-[#185adb] focus:bg-white";
}

function AdminFieldFrame({
  id,
  label,
  value,
  limit,
  helperText,
  error,
  required,
  wrapperClassName,
  shrinkParts,
  children,
}: {
  id: string;
  label: string;
  value: string;
  limit?: TextFieldLimit;
  helperText?: string;
  error?: string;
  required?: boolean;
  wrapperClassName?: string;
  shrinkParts?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={wrapperClassName}>
      <div
        className={cn(
          "flex items-center justify-between gap-2 mb-1.5",
          shrinkParts && "shrink-0"
        )}
      >
        <label
          htmlFor={id}
          className="block text-[12.5px] font-medium text-[#0c0f1d] truncate"
        >
          {label}
          {required && <span className="text-[#185adb] ml-0.5">*</span>}
        </label>
        <LimitCounterMeta value={value} limit={limit} />
      </div>

      {children}

      {error ? (
        <p className={cn("mt-1.5 text-[12px] text-red-500", shrinkParts && "shrink-0")}>
          {error}
        </p>
      ) : (
        helperText && (
          <p className={cn("mt-1.5 text-[12px] text-zinc-400", shrinkParts && "shrink-0")}>
            {helperText}
          </p>
        )
      )}
    </div>
  );
}

export function AdminTextField({
  id,
  label,
  value,
  onChange,
  form,
  limit,
  helperText,
  error,
  placeholder,
  required,
  type = "text",
}: AdminTextFieldProps) {
  const isInvalid = Boolean(error) || hasLimitViolation(value, limit);

  return (
    <AdminFieldFrame
      id={id}
      label={label}
      value={value}
      limit={limit}
      helperText={helperText}
      error={error}
      required={required}
    >
      <input
        id={id}
        form={form}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(INPUT_BASE_CLASS, getFieldInputBorderClass(isInvalid))}
      />
    </AdminFieldFrame>
  );
}

interface AdminTextareaFieldProps extends BaseFieldProps {
  rows?: number;
  fillHeight?: boolean;
}

export function AdminTextareaField({
  id,
  label,
  value,
  onChange,
  form,
  limit,
  helperText,
  error,
  placeholder,
  required,
  rows = 3,
  fillHeight = false,
}: AdminTextareaFieldProps) {
  const isInvalid = Boolean(error) || hasLimitViolation(value, limit);

  return (
    <AdminFieldFrame
      id={id}
      label={label}
      value={value}
      limit={limit}
      helperText={helperText}
      error={error}
      required={required}
      wrapperClassName={cn(fillHeight && "lg:flex-1 lg:flex lg:flex-col lg:min-h-0")}
      shrinkParts={fillHeight}
    >
      <textarea
        id={id}
        form={form}
        rows={rows}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          INPUT_BASE_CLASS,
          "resize-none leading-[1.6]",
          fillHeight && "lg:flex-1 lg:min-h-[110px]",
          getFieldInputBorderClass(isInvalid)
        )}
      />
    </AdminFieldFrame>
  );
}

interface AdminSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

export function AdminSwitch({
  checked,
  onChange,
  label,
  description,
}: AdminSwitchProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[16px] border border-zinc-200/80 bg-[#f4f5f7] px-4 py-3.5">
      <div className="min-w-0">
        <span className="block text-[13.5px] sm:text-[14px] font-medium text-[#0c0f1d]">
          {label}
        </span>
        {description && (
          <span className="block text-[12px] text-zinc-500 mt-0.5 leading-[1.5]">
            {description}
          </span>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors duration-200 cursor-pointer",
          checked ? "bg-[#185adb]" : "bg-zinc-300"
        )}
      >
        <span
          className={cn(
            "inline-block h-5 w-5 rounded-full bg-white transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

export function AdminToast({
  toast,
  onDismiss,
}: {
  toast: AdminToastState | null;
  onDismiss: () => void;
}) {
  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full border px-4 py-2.5 text-[13px] sm:text-[13.5px] font-medium transition-all",
        isSuccess
          ? "border-[#185adb]/20 bg-white text-[#0c0f1d] shadow-[0_10px_28px_rgba(12,15,29,0.08)]"
          : "border-red-200 bg-red-50 text-red-700 shadow-[0_10px_28px_rgba(185,28,28,0.08)]"
      )}
    >
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full shrink-0",
          isSuccess ? "bg-[#185adb] text-white" : "bg-red-500 text-white"
        )}
      >
        {isSuccess ? (
          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
        ) : (
          <AlertCircle className="h-3.5 w-3.5" />
        )}
      </span>
      <span className="max-w-[280px] sm:max-w-[360px] leading-snug">
        {toast.message}
      </span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Tutup notifikasi"
        className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors cursor-pointer"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

interface AdminConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Ya, Hapus Permanen",
  onConfirm,
  onCancel,
}: AdminConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c0f1d]/40 backdrop-blur-[2px] p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white p-6 sm:p-8 text-[#0c0f1d]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] leading-snug">
          {title}
        </h3>
        <p className="mt-2.5 text-[14px] leading-[1.6] text-zinc-500">
          {description}
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-zinc-200/90 bg-white hover:bg-zinc-50 px-5 py-2.5 text-[13.5px] font-medium text-[#0c0f1d] transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-red-600 hover:bg-red-700 px-5 py-2.5 text-[13.5px] font-medium text-white transition-colors cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

