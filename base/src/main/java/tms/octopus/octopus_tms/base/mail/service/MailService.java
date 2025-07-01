package tms.octopus.octopus_tms.base.mail.service;


public interface MailService {

    void sendMail(String mailTo, String subject, String html);

}
