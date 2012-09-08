class NotifierMailer < ActionMailer::Base
  default :from => 'Crowdvoice <subscriptions@bahrainhub.org>'

  layout 'email'

  # Confirmation for subscription when created
  def subscription_confirmation(subscription)
    setup_mail(subscription)
    @subject += 'Subscription confirmation'
    @title = 'WELCOME TO CROWDVOICE'
    mail(:to => subscription.email, :subject => @subject)
  end

  # Confirmation for subscription when created
  def reset_password_instructions(user)
    @user = user
    @subject = 'Reset password confirmation'
    @title = 'RESET PASSWORD INSTRUCTIONS FOR CROWDVOICE ACCOUNT'
    mail(:to => user.email, :from => 'send@bahrainhub.org', :subject => @subject)
  end

  # Digest for today's contents added to the voice
  def daily_digest(subscription)
    setup_mail(subscription)
    @contents = @voice.posts.digest
    @subject += "Digest for #{@voice.title}"
    @title = 'HERE\'S YOUR DAILY DIGEST'
    mail(:to => subscription.email, :subject => @subject)
  end

  # Imap download too big!
  #
  # Deliver this email when imap downloads are too big and can't be
  # added to the crowdvoice system.
  #
  # TODO: Refactor subject, code repetition.
  def imap_invalid_mail subject, target_recipient, target_receiver
    @subject = '[Crowdvoice] ' + 'Email is too big!'
    @sent_subject, @target_recipient = subject, target_recipient
    @target_receiver = target_receiver
    mail(:to => target_recipient, :subject => @subject) do |format|
      format.text { render 'imap_invalid_mail', :layout => nil }
    end
  end

  # Notification to admin when a new voice has been submitted
  def voice_submitted voice_id, admin_email
    @voice = Voice.find(voice_id)
    @title = 'VOICE SUBMITTED'
    mail(:to => admin_email, :from => 'send@bahrainhub.org', :subject => 'Voice submitted')
  end

  # Notification to poster when their voice has been submitted
  def voice_has_been_submitted voice_id
    @voice = Voice.find(voice_id)
    @title = 'VOICE HAS BEEN SUBMITTED'
    mail(:to => @voice.user.email, :from => 'send@bahrainhub.org', :subject => 'Voice has been submitted')
  end

  # Notification to poster when their voice has been approved
  def voice_approved voice_id
    @voice = Voice.find(voice_id)
    @title = 'VOICE APPROVED'
    mail(:to => @voice.user.email, :from => 'send@bahrainhub.org', :subject => 'Voice approved')
  end

  def sign_up_mail user
    @user = user
    @subject = '[Crowdvoice] Welcome'
    @title = 'WELCOME'
    mail(:to => user.email, :from => 'send@bahrainhub.org', :subject => @subject)
  end

  private

  def setup_mail(subscription)
    @subscription = subscription
    @voice = @subscription.voice
    @subject = '[Crowdvoice] '
  end
end