import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import type { Product, ProductPayload } from '../../../shared/types/product'

interface ProductFormModalProps {
  isOpen: boolean
  mode: 'create' | 'edit'
  initialProduct: Product | null
  submitError: string
  onClose: () => void
  onSubmit: (payload: ProductPayload) => Promise<void>
}

const productSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio.'),
  descripcion: z.string().trim().min(1, 'La descripcion es obligatoria.'),
  subcategoria: z.string().trim().min(1, 'La subcategoria es obligatoria.'),
  precio: z
    .number()
    .refine(
      (value) => Number.isFinite(value) && value > 0,
      'El precio debe ser un numero positivo.',
    ),
  precioxcantidad: z
    .number()
    .refine(
      (value) => Number.isFinite(value) && value > 0,
      'El precio por cantidad debe ser un numero positivo.',
    ),
  estado: z.enum(['activo', 'inactivo']),
})

const initialFormValues: ProductPayload = {
  nombre: '',
  descripcion: '',
  subcategoria: '',
  precio: 0,
  precioxcantidad: 0,
  estado: 'activo',
}

export const ProductFormModal = ({
  isOpen,
  mode,
  initialProduct,
  submitError,
  onClose,
  onSubmit,
}: ProductFormModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductPayload>({
    resolver: zodResolver(productSchema),
    defaultValues: initialFormValues,
  })

  useEffect(() => {
    if (!isOpen) return

    if (initialProduct) {
      reset({
        nombre: initialProduct.nombre,
        descripcion: initialProduct.descripcion,
        subcategoria: initialProduct.subcategoria,
        precio: initialProduct.precio,
        precioxcantidad: initialProduct.precioxcantidad,
        estado: initialProduct.estado,
      })
      return
    }

    reset(initialFormValues)
  }, [isOpen, initialProduct, reset])

  if (!isOpen) {
    return null
  }

  const submit = async (values: ProductPayload) => {
    await onSubmit({
      nombre: values.nombre.trim(),
      descripcion: values.descripcion.trim(),
      subcategoria: values.subcategoria.trim(),
      precio: values.precio,
      precioxcantidad: values.precioxcantidad,
      estado: values.estado,
    })
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="product-form-title">
          {mode === 'create' ? 'Crear producto' : 'Editar producto'}
        </h2>

        <form className="form-grid" onSubmit={handleSubmit(submit)} noValidate>
          <label className="field-group" htmlFor="product-name">
            Nombre
            <input id="product-name" type="text" {...register('nombre')} />
            {errors.nombre ? <span className="error-text">{errors.nombre.message}</span> : null}
          </label>

          <label className="field-group" htmlFor="product-description">
            Descripcion
            <textarea id="product-description" rows={3} {...register('descripcion')} />
            {errors.descripcion ? (
              <span className="error-text">{errors.descripcion.message}</span>
            ) : null}
          </label>

          <label className="field-group" htmlFor="product-subcategory">
            Subcategoria
            <input id="product-subcategory" type="text" {...register('subcategoria')} />
            {errors.subcategoria ? (
              <span className="error-text">{errors.subcategoria.message}</span>
            ) : null}
          </label>

          <div className="split-fields">
            <label className="field-group" htmlFor="product-price">
              Precio
              <input
                id="product-price"
                type="number"
                min={0}
                step="0.01"
                {...register('precio', { valueAsNumber: true })}
              />
              {errors.precio ? <span className="error-text">{errors.precio.message}</span> : null}
            </label>

            <label className="field-group" htmlFor="product-price-quantity">
              Precio por cantidad
              <input
                id="product-price-quantity"
                type="number"
                min={0}
                step="0.01"
                {...register('precioxcantidad', { valueAsNumber: true })}
              />
              {errors.precioxcantidad ? (
                <span className="error-text">{errors.precioxcantidad.message}</span>
              ) : null}
            </label>
          </div>

          <label className="field-group" htmlFor="product-status">
            Estado
            <select id="product-status" {...register('estado')}>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
            {errors.estado ? <span className="error-text">{errors.estado.message}</span> : null}
          </label>

          {submitError ? <p className="alert error">{submitError}</p> : null}

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </button>
            <button type="submit" className="primary-btn" disabled={isSubmitting}>
              {isSubmitting
                ? 'Guardando...'
                : mode === 'create'
                  ? 'Crear producto'
                  : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
