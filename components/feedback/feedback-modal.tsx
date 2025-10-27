'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MessageSquare, Bug, Lightbulb, MessageCircle, Loader2, CheckCircle } from 'lucide-react';
import { submitFeedback } from '@/app/actions/feedback';
import { toast } from '@/hooks/use-toast';

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FEEDBACK_TYPES = [
  { value: 'bug', label: 'Reportar Bug', icon: Bug, description: 'Encontrou algo que não funciona?' },
  { value: 'suggestion', label: 'Sugestão', icon: Lightbulb, description: 'Tem uma ideia para melhorar?' },
  { value: 'comment', label: 'Comentário', icon: MessageCircle, description: 'Quer compartilhar sua opinião?' },
  { value: 'other', label: 'Outro', icon: MessageSquare, description: 'Qualquer outro feedback' },
];

export default function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState<string>('comment');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>('');

  const handleClose = () => {
    if (!isSubmitting) {
      setFeedbackType('comment');
      setMessage('');
      setError('');
      onOpenChange(false);
      setIsSuccess(false);
    }
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('Por favor, escreva sua mensagem');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await submitFeedback(feedbackType, message.trim());

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        toast({
          title: 'Erro',
          description: result.error || 'Não foi possível enviar seu feedback. Tente novamente mais tarde.',
          variant: 'destructive',
        });
      }
    } catch (err) {
        toast({
          title: 'Erro',
          description: 'Não foi possível enviar seu feedback. Tente novamente mais tarde.',
          variant: 'destructive',
        });
      //
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-[95vw] overflow-y-auto sm:max-w-lg">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold">Feedback Enviado!</h3>
            <p className="text-sm text-muted-foreground">Obrigado por nos ajudar a melhorar a plataforma.</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold sm:text-2xl">Enviar Feedback</DialogTitle>
              <DialogDescription className="text-sm">
                Sua opinião é muito importante para nós! Compartilhe bugs, sugestões ou comentários.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Feedback Type Selection */}
              <div>
                <Label className="mb-3 block text-sm font-medium">Tipo de Feedback</Label>
                <RadioGroup value={feedbackType} onValueChange={setFeedbackType} className="space-y-3">
                  {FEEDBACK_TYPES.map((type) => {
                    return (
                      <div
                        key={type.value}
                        className={`flex items-start space-x-3 rounded-lg border p-3 transition-colors ${
                          feedbackType === type.value ? 'border-orange-alert bg-orange-alert/5' : 'border-border'
                        }`}
                      >
                        <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                        <label htmlFor={type.value} className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{type.label}</span>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{type.description}</p>
                        </label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>

              {/* Message Input */}
              <div>
                <Label htmlFor="message" className="mb-2 block text-sm font-medium">
                  Sua Mensagem
                </Label>
                <Textarea
                  id="message"
                  placeholder="Descreva seu feedback em detalhes..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="resize-none"
                  disabled={isSubmitting}
                />
                <p className="mt-1 text-xs text-muted-foreground">{message.length} / 1000 caracteres</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>
              )}

              {/* Info Box */}
              <div className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground">
                <p>
                  💡 <strong>Nota:</strong> Você pode enviar feedback a cada 30 minutos. Responderemos por e-mail se
                  necessário.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} disabled={isSubmitting} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !message.trim()}
                className="flex-1 bg-orange-alert hover:bg-orange-alert/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Feedback'
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
