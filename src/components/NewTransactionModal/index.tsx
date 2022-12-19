import * as Dialog from '@radix-ui/react-dialog'
import { ArrowCircleDown, ArrowCircleUp, X } from 'phosphor-react'
import { CloseButton, Content, Overlay, TransactionType, TransactionTypeButtom } from './styles'
import * as z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../../lib/axios'
import { useContext } from 'react'
import { TransactionsContext } from '../../contexts/TransactionsContext'

const newTransactionFormSchema = z.object({
  description: z.string(),
  price: z.number(),
  category: z.string(),
  type: z.enum(['income', 'outcome']),
})

type NewTransationFormInputs = z.infer<typeof newTransactionFormSchema>

export function NewTransactionModal() {
  const { createTransaction } = useContext(TransactionsContext)
  const {
    control, //zod control para obter informacoes do formulario que nao vem de um elemento html nativo
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<NewTransationFormInputs>({
    resolver: zodResolver(newTransactionFormSchema),
    defaultValues: {
      type: 'income'
    }
  })

  async function handleCreateNewTransaction(data: NewTransationFormInputs) {
    const { description, price, category, type } = data


    await createTransaction({
      category,
      description,
      price,
      type,
    })

    reset();
  }


  return (
    <Dialog.Portal>
      <Overlay />

      <Content >
        <Dialog.Title>Nova Transacao</Dialog.Title>

        <CloseButton>
          <X size={24} />
        </CloseButton>


        <form onSubmit={handleSubmit(handleCreateNewTransaction)}>
          <input
            type="text"
            placeholder='Descricao'
            required
            {...register('description')}
          />

          <input
            type="number"
            placeholder='Preco'
            required
            {...register('price', { valueAsNumber: true })}
          />

          <input
            type="text"
            placeholder='Categoria'
            required
            {...register('category')}
          />

          <Controller
            control={control}
            name='type'
            render={({ field }) => {
              return (
                <TransactionType
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <TransactionTypeButtom variant='income' value='income'>
                    <ArrowCircleUp size={24} />
                    Entrada
                  </TransactionTypeButtom>

                  <TransactionTypeButtom variant='outcome' value='outcome'>
                    <ArrowCircleDown size={24} />
                    Saida
                  </TransactionTypeButtom>
                </TransactionType>

              )
            }}
          />


          <button type='submit' disabled={isSubmitting}>
            Cadastrar
          </button>
        </form>


      </Content>
    </Dialog.Portal>

  )
}