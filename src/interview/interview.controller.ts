import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewDto } from './dto/interview.dto';
import { chatSession } from '../utils/gemini.ai';
import { AuthGuard as JWTAuthGuard } from 'src/auth/auth.guard';
import { AnswerQuestionDto } from './dto/user.answer.dto';
import { SearchMockInterviewDto } from './dto/search.dto';
@Controller('interview')
@UseGuards(JWTAuthGuard)
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Get('search')
  async searchMockInterview(@Query() searchDto: SearchMockInterviewDto) {
    console.log('Received searchDto:', searchDto);
    return this.interviewService.searchMockInterview(searchDto);
  }
  @Post('create')
  async saveInterviewData(@Body() interviewDto: InterviewDto) {
    const InputPromptTemplate = process.env.INPUT_PROMPT;
    const InputPrompt = InputPromptTemplate.replace(
      '{{jobPosition}}',
      interviewDto.jobPosition,
    )
      .replace('{{jobDescription}}', interviewDto.jobDesc)
      .replace('{{experience}}', interviewDto.jobExperience)
      .replace('{{companyInfo}}', interviewDto.companyInfo)
      .replace('{{interviewLanguage}}', interviewDto.interviewLanguage)
      .replace('{{additionalDetails}}', interviewDto.additionalDetails);
    const res = await chatSession.sendMessage(InputPrompt);
    const MockJsonResponse = res.response.text();
    const saveInterviewResponse = await this.interviewService.saveInterview({
      ...interviewDto,
      jsonMockResp: MockJsonResponse,
    });
    return { interviewId: saveInterviewResponse };
  }
  @Post('feedback')
  async saveAnswerQuestion(@Body() answerQuestion: AnswerQuestionDto) {
    const FeedBackPromptTemplate = process.env.FEEDBACK_PROMPT;
    const FeedbackPrompt = FeedBackPromptTemplate.replace(
      '{{mockInterviewQuestions[activeQuestionIndex].question}}',
      answerQuestion.question,
    ).replace('{{userAnswer}}', answerQuestion.userAns);
    const res = await chatSession.sendMessage(FeedbackPrompt);
    const FeedBackResponse = JSON.parse(res.response.text());
    const feedback = FeedBackResponse.feedback;
    const rating = FeedBackResponse.rating.toString();
    const saveAnswerQuestionResponse =
      await this.interviewService.saveAnswerQuestion({
        ...answerQuestion,
        feedback,
        rating,
      });
    return saveAnswerQuestionResponse;
  }
  @Get('feedback/:interviewId')
  async getInterviewFeedback(@Param('interviewId') interviewId: string) {
    const getFeedbackDataResponse = await this.interviewService.getFeedBackData(
      {
        interviewId: interviewId,
      },
    );
    return getFeedbackDataResponse;
  }
  @Get(':interviewId')
  async getInterviewData(@Param('interviewId') interviewId: string) {
    const getInterviewDataResponse =
      await this.interviewService.GetInterviewData({
        interviewId: interviewId,
      });
    return getInterviewDataResponse;
  }
  @Get('user/:userId')
  async getAllInterviewData(@Param('userId') userId: string) {
    const getAllInterviewResponse =
      await this.interviewService.GetAllInterviewData({
        userId: userId,
      });
    return getAllInterviewResponse;
  }
}
